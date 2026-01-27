const { WorkDailyStandup, WorkDailyStandupTask, WorkTask, sequelize } = require('../models');
const { Op } = require('sequelize');
const { format, subDays, startOfDay, endOfDay } = require('date-fns');

// Get today's standup
const getTodayStandup = async (request, reply) => {
    try {
        const { userId } = request.params;
        const today = format(new Date(), 'yyyy-MM-dd');

        const standup = await WorkDailyStandup.findOne({
            where: { userId, date: today },
            include: [
                {
                    model: WorkDailyStandupTask,
                    as: 'tasks',
                    include: [{ model: WorkTask, as: 'task' }],
                },
            ],
        });

        return reply.send(standup);
    } catch (error) {
        console.error('Error fetching today standup:', error);
        return reply.status(500).send({ error: 'Failed to fetch today standup' });
    }
};

// Get yesterday's tasks for a user
const getYesterdayTasks = async (request, reply) => {
    try {
        const { userId } = request.params;
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

        // Get tasks that were scheduled for yesterday or worked on yesterday
        const tasks = await WorkTask.findAll({
            where: {
                userId,
                [Op.or]: [
                    { scheduledDate: yesterday },
                    {
                        completedAt: {
                            [Op.between]: [
                                startOfDay(subDays(new Date(), 1)),
                                endOfDay(subDays(new Date(), 1)),
                            ],
                        },
                    },
                ],
            },
            order: [['completedAt', 'DESC'], ['createdAt', 'ASC']],
        });

        // Mark each task with its status
        const tasksWithStatus = tasks.map(task => ({
            ...task.toJSON(),
            yesterdayStatus: task.completedAt ? 'completed' : 'in_progress',
        }));

        return reply.send(tasksWithStatus);
    } catch (error) {
        console.error('Error fetching yesterday tasks:', error);
        return reply.status(500).send({ error: 'Failed to fetch yesterday tasks' });
    }
};

// Get today's pending tasks
const getTodayPendingTasks = async (request, reply) => {
    try {
        const { userId } = request.params;
        const today = format(new Date(), 'yyyy-MM-dd');

        const tasks = await WorkTask.findAll({
            where: {
                userId,
                completedAt: null,
                [Op.or]: [
                    { scheduledDate: today },
                    {
                        deadline: {
                            [Op.lte]: endOfDay(new Date()),
                        },
                    },
                    { priorityQuadrant: 'DO_NOW' },
                ],
            },
            order: [
                ['priorityQuadrant', 'ASC'],
                ['deadline', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        });

        return reply.send(tasks);
    } catch (error) {
        console.error('Error fetching today pending tasks:', error);
        return reply.status(500).send({ error: 'Failed to fetch today pending tasks' });
    }
};

// Create daily standup
const createDailyStandup = async (request, reply) => {
    const transaction = await sequelize.transaction();

    try {
        const { userId } = request.params;
        const {
            energyLevel,
            hasBlockers,
            blockerDescription,
            notes,
            yesterdayTasks,
            todayTasks,
        } = request.body;

        const today = format(new Date(), 'yyyy-MM-dd');

        // Check if standup already exists for today
        const existing = await WorkDailyStandup.findOne({
            where: { userId, date: today },
        });

        if (existing) {
            await transaction.rollback();
            return reply.status(400).send({ error: 'Standup already exists for today' });
        }

        // Create standup
        const standup = await WorkDailyStandup.create({
            userId,
            date: today,
            energyLevel,
            hasBlockers,
            blockerDescription: hasBlockers ? blockerDescription : null,
            notes,
        }, { transaction });

        // Add yesterday tasks
        if (yesterdayTasks && yesterdayTasks.length > 0) {
            const yesterdayTasksData = yesterdayTasks.map(t => ({
                standupId: standup.id,
                taskId: t.taskId || null,
                customDescription: t.customDescription || null,
                isFromYesterday: true,
                status: t.status || 'completed',
            }));

            await WorkDailyStandupTask.bulkCreate(yesterdayTasksData, { transaction });
        }

        // Add today tasks
        if (todayTasks && todayTasks.length > 0) {
            const todayTasksData = todayTasks.map(t => ({
                standupId: standup.id,
                taskId: t.taskId || null,
                customDescription: t.customDescription || null,
                isFromYesterday: false,
                status: t.status || 'not_started',
            }));

            await WorkDailyStandupTask.bulkCreate(todayTasksData, { transaction });
        }

        await transaction.commit();

        // Fetch full standup with tasks
        const fullStandup = await WorkDailyStandup.findByPk(standup.id, {
            include: [
                {
                    model: WorkDailyStandupTask,
                    as: 'tasks',
                    include: [{ model: WorkTask, as: 'task' }],
                },
            ],
        });

        return reply.status(201).send(fullStandup);
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating daily standup:', error);
        return reply.status(500).send({ error: 'Failed to create daily standup' });
    }
};

// Update daily standup
const updateDailyStandup = async (request, reply) => {
    try {
        const { id } = request.params;
        const data = request.body;

        const standup = await WorkDailyStandup.findByPk(id);

        if (!standup) {
            return reply.status(404).send({ error: 'Standup not found' });
        }

        await standup.update({
            energyLevel: data.energyLevel,
            hasBlockers: data.hasBlockers,
            blockerDescription: data.hasBlockers ? data.blockerDescription : null,
            notes: data.notes,
        });

        return reply.send(standup);
    } catch (error) {
        console.error('Error updating daily standup:', error);
        return reply.status(500).send({ error: 'Failed to update daily standup' });
    }
};

// Get standup history
const getStandupHistory = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { startDate, endDate, limit = 30 } = request.query;

        const where = { userId };

        if (startDate && endDate) {
            where.date = {
                [Op.between]: [startDate, endDate],
            };
        }

        const standups = await WorkDailyStandup.findAll({
            where,
            include: [
                {
                    model: WorkDailyStandupTask,
                    as: 'tasks',
                    include: [{ model: WorkTask, as: 'task' }],
                },
            ],
            order: [['date', 'DESC']],
            limit: parseInt(limit),
        });

        return reply.send(standups);
    } catch (error) {
        console.error('Error fetching standup history:', error);
        return reply.status(500).send({ error: 'Failed to fetch standup history' });
    }
};

// Get energy level trends
const getEnergyTrends = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { days = 30 } = request.query;

        const startDate = format(subDays(new Date(), parseInt(days)), 'yyyy-MM-dd');

        const standups = await WorkDailyStandup.findAll({
            where: {
                userId,
                date: { [Op.gte]: startDate },
            },
            attributes: ['date', 'energyLevel'],
            order: [['date', 'ASC']],
        });

        const averageEnergy = standups.length > 0
            ? standups.reduce((acc, s) => acc + s.energyLevel, 0) / standups.length
            : 0;

        return reply.send({
            data: standups,
            averageEnergy: Math.round(averageEnergy * 10) / 10,
            totalDays: standups.length,
        });
    } catch (error) {
        console.error('Error fetching energy trends:', error);
        return reply.status(500).send({ error: 'Failed to fetch energy trends' });
    }
};

module.exports = {
    getTodayStandup,
    getYesterdayTasks,
    getTodayPendingTasks,
    createDailyStandup,
    updateDailyStandup,
    getStandupHistory,
    getEnergyTrends,
};
