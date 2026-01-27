const { WorkEndOfDayReview, WorkTask, WorkTimeEntry, WorkDailyStandup, WorkDailyStandupTask, sequelize } = require('../models');
const { Op } = require('sequelize');
const { format, addDays, startOfDay, endOfDay } = require('date-fns');

// Get today's task completion data
const getTodayTasksCompletion = async (request, reply) => {
    try {
        const { userId } = request.params;
        const today = format(new Date(), 'yyyy-MM-dd');

        // Get tasks that were planned for today (from standup)
        const standup = await WorkDailyStandup.findOne({
            where: { userId, date: today },
            include: [
                {
                    model: WorkDailyStandupTask,
                    as: 'tasks',
                    where: { isFromYesterday: false },
                    required: false,
                    include: [{ model: WorkTask, as: 'task' }],
                },
            ],
        });

        // Get tasks completed today
        const completedToday = await WorkTask.findAll({
            where: {
                userId,
                completedAt: {
                    [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
                },
            },
        });

        // Get tasks scheduled for today
        const scheduledToday = await WorkTask.findAll({
            where: {
                userId,
                scheduledDate: today,
            },
        });

        // Calculate planned vs completed
        const plannedTasks = standup?.tasks || [];
        const plannedCount = plannedTasks.length || scheduledToday.length;
        const completedCount = completedToday.length;

        // Build task list with status
        const allTasks = [];

        // Add planned tasks
        plannedTasks.forEach(pt => {
            const task = pt.task;
            if (task) {
                allTasks.push({
                    id: task.id,
                    title: task.title,
                    isCompleted: !!task.completedAt,
                    wasPlanned: true,
                });
            } else if (pt.customDescription) {
                allTasks.push({
                    id: pt.id,
                    title: pt.customDescription,
                    isCompleted: pt.status === 'completed',
                    wasPlanned: true,
                });
            }
        });

        // Add completed tasks that weren't planned
        completedToday.forEach(task => {
            if (!allTasks.find(t => t.id === task.id)) {
                allTasks.push({
                    id: task.id,
                    title: task.title,
                    isCompleted: true,
                    wasPlanned: false,
                });
            }
        });

        // Add scheduled but not completed
        scheduledToday.forEach(task => {
            if (!allTasks.find(t => t.id === task.id)) {
                allTasks.push({
                    id: task.id,
                    title: task.title,
                    isCompleted: !!task.completedAt,
                    wasPlanned: true,
                });
            }
        });

        return reply.send({
            tasksPlanned: plannedCount,
            tasksCompleted: completedCount,
            completionPercentage: plannedCount > 0 ? Math.round((completedCount / plannedCount) * 100) : 100,
            tasks: allTasks,
        });
    } catch (error) {
        console.error('Error fetching today tasks completion:', error);
        return reply.status(500).send({ error: 'Failed to fetch today tasks completion' });
    }
};

// Get today's worked hours
const getTodayWorkedHours = async (request, reply) => {
    try {
        const { userId } = request.params;
        const today = new Date();

        const entries = await WorkTimeEntry.findAll({
            where: {
                userId,
                startedAt: {
                    [Op.between]: [startOfDay(today), endOfDay(today)],
                },
            },
        });

        let totalSeconds = 0;
        entries.forEach(entry => {
            if (entry.endedAt) {
                totalSeconds += Math.floor((new Date(entry.endedAt) - new Date(entry.startedAt)) / 1000);
            } else if (entry.duration) {
                totalSeconds += entry.duration * 60;
            }
        });

        const hours = totalSeconds / 3600;

        return reply.send({
            totalSeconds,
            hours: Math.round(hours * 100) / 100,
            formatted: `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}min`,
        });
    } catch (error) {
        console.error('Error fetching today worked hours:', error);
        return reply.status(500).send({ error: 'Failed to fetch today worked hours' });
    }
};

// Move uncompleted tasks to tomorrow
const moveUncompletedTasksToTomorrow = async (request, reply) => {
    try {
        const { userId } = request.params;
        const today = format(new Date(), 'yyyy-MM-dd');
        const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

        // Get uncompleted tasks scheduled for today
        const [affectedRows] = await WorkTask.update(
            { scheduledDate: tomorrow },
            {
                where: {
                    userId,
                    scheduledDate: today,
                    completedAt: null,
                },
            }
        );

        return reply.send({
            movedCount: affectedRows,
            newDate: tomorrow,
        });
    } catch (error) {
        console.error('Error moving uncompleted tasks:', error);
        return reply.status(500).send({ error: 'Failed to move uncompleted tasks' });
    }
};

// Create end of day review
const createEndOfDayReview = async (request, reply) => {
    try {
        const { userId } = request.params;
        const {
            productivityRating,
            notes,
            moveUncompletedTasks,
        } = request.body;

        const today = format(new Date(), 'yyyy-MM-dd');

        // Check if review already exists
        const existing = await WorkEndOfDayReview.findOne({
            where: { userId, date: today },
        });

        if (existing) {
            return reply.status(400).send({ error: 'End of day review already exists for today' });
        }

        // Get task completion data
        const standup = await WorkDailyStandup.findOne({
            where: { userId, date: today },
            include: [
                {
                    model: WorkDailyStandupTask,
                    as: 'tasks',
                    where: { isFromYesterday: false },
                    required: false,
                },
            ],
        });

        const completedToday = await WorkTask.count({
            where: {
                userId,
                completedAt: {
                    [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
                },
            },
        });

        const scheduledToday = await WorkTask.count({
            where: {
                userId,
                scheduledDate: today,
            },
        });

        const tasksPlanned = standup?.tasks?.length || scheduledToday;

        // Get worked hours
        const entries = await WorkTimeEntry.findAll({
            where: {
                userId,
                startedAt: {
                    [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
                },
            },
        });

        let totalSeconds = 0;
        entries.forEach(entry => {
            if (entry.endedAt) {
                totalSeconds += Math.floor((new Date(entry.endedAt) - new Date(entry.startedAt)) / 1000);
            } else if (entry.duration) {
                totalSeconds += entry.duration * 60;
            }
        });

        const hoursWorked = totalSeconds / 3600;

        // Move uncompleted tasks if requested
        let tasksMoved = false;
        if (moveUncompletedTasks) {
            const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
            await WorkTask.update(
                { scheduledDate: tomorrow },
                {
                    where: {
                        userId,
                        scheduledDate: today,
                        completedAt: null,
                    },
                }
            );
            tasksMoved = true;
        }

        // Create review
        const review = await WorkEndOfDayReview.create({
            userId,
            date: today,
            tasksPlanned,
            tasksCompleted: completedToday,
            hoursWorked: Math.round(hoursWorked * 100) / 100,
            productivityRating,
            notes,
            uncompletedTasksMoved: tasksMoved,
        });

        return reply.status(201).send(review);
    } catch (error) {
        console.error('Error creating end of day review:', error);
        return reply.status(500).send({ error: 'Failed to create end of day review' });
    }
};

// Get today's end of day review
const getTodayReview = async (request, reply) => {
    try {
        const { userId } = request.params;
        const today = format(new Date(), 'yyyy-MM-dd');

        const review = await WorkEndOfDayReview.findOne({
            where: { userId, date: today },
        });

        return reply.send(review);
    } catch (error) {
        console.error('Error fetching today review:', error);
        return reply.status(500).send({ error: 'Failed to fetch today review' });
    }
};

// Get review history
const getReviewHistory = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { startDate, endDate, limit = 30 } = request.query;

        const where = { userId };

        if (startDate && endDate) {
            where.date = {
                [Op.between]: [startDate, endDate],
            };
        }

        const reviews = await WorkEndOfDayReview.findAll({
            where,
            order: [['date', 'DESC']],
            limit: parseInt(limit),
        });

        return reply.send(reviews);
    } catch (error) {
        console.error('Error fetching review history:', error);
        return reply.status(500).send({ error: 'Failed to fetch review history' });
    }
};

// Get productivity trends
const getProductivityTrends = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { days = 30 } = request.query;

        const startDate = format(addDays(new Date(), -parseInt(days)), 'yyyy-MM-dd');

        const reviews = await WorkEndOfDayReview.findAll({
            where: {
                userId,
                date: { [Op.gte]: startDate },
            },
            attributes: ['date', 'productivityRating', 'tasksPlanned', 'tasksCompleted', 'hoursWorked'],
            order: [['date', 'ASC']],
        });

        const totalDays = reviews.length;
        const averageProductivity = totalDays > 0
            ? reviews.reduce((acc, r) => acc + r.productivityRating, 0) / totalDays
            : 0;
        const averageCompletion = totalDays > 0
            ? reviews.reduce((acc, r) => {
                if (r.tasksPlanned > 0) {
                    return acc + (r.tasksCompleted / r.tasksPlanned) * 100;
                }
                return acc + 100;
            }, 0) / totalDays
            : 0;
        const averageHours = totalDays > 0
            ? reviews.reduce((acc, r) => acc + parseFloat(r.hoursWorked), 0) / totalDays
            : 0;

        return reply.send({
            data: reviews,
            averageProductivity: Math.round(averageProductivity * 10) / 10,
            averageCompletion: Math.round(averageCompletion),
            averageHours: Math.round(averageHours * 10) / 10,
            totalDays,
        });
    } catch (error) {
        console.error('Error fetching productivity trends:', error);
        return reply.status(500).send({ error: 'Failed to fetch productivity trends' });
    }
};

module.exports = {
    getTodayTasksCompletion,
    getTodayWorkedHours,
    moveUncompletedTasksToTomorrow,
    createEndOfDayReview,
    getTodayReview,
    getReviewHistory,
    getProductivityTrends,
};
