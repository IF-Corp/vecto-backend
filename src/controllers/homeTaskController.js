const { HomeTask, HomeTaskOccurrence, HomeSpace, HomeMember, sequelize } = require('../models');
const { Op } = require('sequelize');
const { addDays, startOfDay, endOfDay, format, parseISO, addWeeks, addMonths } = require('date-fns');

// ==================== TASKS ====================

const getTasks = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const tasks = await HomeTask.findAll({
            where: { space_id: spaceId },
            include: [
                { model: HomeMember, as: 'assignedMember', attributes: ['id', 'name'] },
            ],
            order: [['name', 'ASC']],
        });
        return { success: true, data: tasks };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getTask = async (request, reply) => {
    try {
        const { id } = request.params;
        const task = await HomeTask.findByPk(id, {
            include: [
                { model: HomeMember, as: 'assignedMember', attributes: ['id', 'name'] },
            ],
        });
        if (!task) {
            reply.status(404);
            return { success: false, error: 'Task not found' };
        }
        return { success: true, data: task };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createTask = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const task = await HomeTask.create({
            ...request.body,
            space_id: spaceId,
        });

        // Generate initial occurrences for next 30 days
        await generateOccurrencesForTask(task, 30);

        const taskWithRelations = await HomeTask.findByPk(task.id, {
            include: [
                { model: HomeMember, as: 'assignedMember', attributes: ['id', 'name'] },
            ],
        });

        reply.status(201);
        return { success: true, data: taskWithRelations, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateTask = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await HomeTask.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Task not found' };
        }

        // If frequency changed, regenerate future occurrences
        if (request.body.frequency || request.body.frequency_days) {
            const task = await HomeTask.findByPk(id);
            await HomeTaskOccurrence.destroy({
                where: {
                    task_id: id,
                    status: 'PENDING',
                    due_date: { [Op.gte]: new Date() },
                },
            });
            await generateOccurrencesForTask(task, 30);
        }

        const task = await HomeTask.findByPk(id, {
            include: [
                { model: HomeMember, as: 'assignedMember', attributes: ['id', 'name'] },
            ],
        });
        return { success: true, data: task };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteTask = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await HomeTask.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Task not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== OCCURRENCES ====================

const getTodayOccurrences = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const today = format(new Date(), 'yyyy-MM-dd');

        const occurrences = await HomeTaskOccurrence.findAll({
            include: [
                {
                    model: HomeTask,
                    as: 'task',
                    where: { space_id: spaceId, is_active: true },
                    include: [
                        { model: HomeMember, as: 'assignedMember', attributes: ['id', 'name'] },
                    ],
                },
                { model: HomeMember, as: 'completedBy', attributes: ['id', 'name'] },
            ],
            where: { due_date: today },
            order: [[{ model: HomeTask, as: 'task' }, 'name', 'ASC']],
        });

        return { success: true, data: occurrences };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getOccurrencesByDateRange = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const { startDate, endDate } = request.query;

        const occurrences = await HomeTaskOccurrence.findAll({
            include: [
                {
                    model: HomeTask,
                    as: 'task',
                    where: { space_id: spaceId },
                    include: [
                        { model: HomeMember, as: 'assignedMember', attributes: ['id', 'name'] },
                    ],
                },
                { model: HomeMember, as: 'completedBy', attributes: ['id', 'name'] },
            ],
            where: {
                due_date: {
                    [Op.between]: [startDate, endDate],
                },
            },
            order: [['due_date', 'ASC'], [{ model: HomeTask, as: 'task' }, 'name', 'ASC']],
        });

        return { success: true, data: occurrences };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const completeOccurrence = async (request, reply) => {
    try {
        const { id } = request.params;
        const { completed_by_member_id, notes } = request.body;

        const [updated] = await HomeTaskOccurrence.update(
            {
                status: 'COMPLETED',
                completed_at: new Date(),
                completed_by_member_id,
                notes,
            },
            { where: { id } }
        );

        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Occurrence not found' };
        }

        const occurrence = await HomeTaskOccurrence.findByPk(id, {
            include: [
                { model: HomeTask, as: 'task' },
                { model: HomeMember, as: 'completedBy', attributes: ['id', 'name'] },
            ],
        });

        return { success: true, data: occurrence };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const skipOccurrence = async (request, reply) => {
    try {
        const { id } = request.params;
        const { notes } = request.body;

        const [updated] = await HomeTaskOccurrence.update(
            { status: 'SKIPPED', notes },
            { where: { id } }
        );

        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Occurrence not found' };
        }

        const occurrence = await HomeTaskOccurrence.findByPk(id);
        return { success: true, data: occurrence };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const undoOccurrence = async (request, reply) => {
    try {
        const { id } = request.params;

        const [updated] = await HomeTaskOccurrence.update(
            {
                status: 'PENDING',
                completed_at: null,
                completed_by_member_id: null,
            },
            { where: { id } }
        );

        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Occurrence not found' };
        }

        const occurrence = await HomeTaskOccurrence.findByPk(id);
        return { success: true, data: occurrence };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== HELPERS ====================

async function generateOccurrencesForTask(task, daysAhead) {
    const occurrences = [];
    const today = startOfDay(new Date());
    const endDate = addDays(today, daysAhead);

    let currentDate = today;
    while (currentDate <= endDate) {
        const shouldCreate = shouldCreateOccurrence(task, currentDate);
        if (shouldCreate) {
            occurrences.push({
                task_id: task.id,
                due_date: format(currentDate, 'yyyy-MM-dd'),
                status: 'PENDING',
            });
        }
        currentDate = addDays(currentDate, 1);
    }

    if (occurrences.length > 0) {
        await HomeTaskOccurrence.bulkCreate(occurrences, {
            ignoreDuplicates: true,
        });
    }
}

function shouldCreateOccurrence(task, date) {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();

    switch (task.frequency) {
        case 'DAILY':
            return true;
        case 'WEEKLY':
            return task.frequency_days?.includes(dayOfWeek) ?? dayOfWeek === 1;
        case 'BIWEEKLY':
            // Every other week on specified days
            const weekNumber = Math.floor((date - new Date(date.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
            return weekNumber % 2 === 0 && (task.frequency_days?.includes(dayOfWeek) ?? dayOfWeek === 1);
        case 'MONTHLY':
            return task.frequency_days?.includes(dayOfMonth) ?? dayOfMonth === 1;
        case 'CUSTOM':
            // Custom interval from last occurrence or creation
            return true; // Simplified - in production, track last occurrence
        default:
            return false;
    }
}

// ==================== STATS ====================

const getTaskStats = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const today = format(new Date(), 'yyyy-MM-dd');
        const weekStart = format(addDays(new Date(), -7), 'yyyy-MM-dd');

        const [todayStats, weekStats] = await Promise.all([
            HomeTaskOccurrence.findAll({
                attributes: [
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('HomeTaskOccurrence.id')), 'count'],
                ],
                include: [{
                    model: HomeTask,
                    as: 'task',
                    where: { space_id: spaceId },
                    attributes: [],
                }],
                where: { due_date: today },
                group: ['status'],
                raw: true,
            }),
            HomeTaskOccurrence.findAll({
                attributes: [
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('HomeTaskOccurrence.id')), 'count'],
                ],
                include: [{
                    model: HomeTask,
                    as: 'task',
                    where: { space_id: spaceId },
                    attributes: [],
                }],
                where: {
                    due_date: { [Op.between]: [weekStart, today] },
                },
                group: ['status'],
                raw: true,
            }),
        ]);

        return {
            success: true,
            data: {
                today: todayStats.reduce((acc, s) => ({ ...acc, [s.status]: parseInt(s.count) }), {}),
                week: weekStats.reduce((acc, s) => ({ ...acc, [s.status]: parseInt(s.count) }), {}),
            },
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTodayOccurrences,
    getOccurrencesByDateRange,
    completeOccurrence,
    skipOccurrence,
    undoOccurrence,
    getTaskStats,
};
