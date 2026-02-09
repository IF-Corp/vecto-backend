const { Op } = require('sequelize');
const sequelize = require('../config/sequelize');

const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const Task = require('../models/Task');
const RecurringExpense = require('../models/RecurringExpense');
const HomeSpace = require('../models/HomeSpace');
const HomeTaskOccurrence = require('../models/HomeTaskOccurrence');
const HomeTask = require('../models/HomeTask');
const HomeMaintenance = require('../models/HomeMaintenance');

async function getNotificationCounts(request, reply) {
    try {
        const { userId } = request.params;
        const today = new Date().toISOString().split('T')[0];

        const [habits, tasks, finance, home] = await Promise.all([
            countPendingHabits(userId, today),
            countPendingTasks(userId, today),
            countPendingFinance(userId, today),
            countPendingHome(userId, today),
        ]);

        return { success: true, habits, tasks, finance, home };
    } catch (error) {
        console.error('Error fetching notification counts:', error);
        return { success: true, habits: 0, tasks: 0, finance: 0, home: 0 };
    }
}

async function countPendingHabits(userId, today) {
    try {
        // Count active habits that don't have a log for today
        const activeHabits = await Habit.findAll({
            where: {
                user_id: userId,
                status: 'active',
                is_frozen: false,
            },
            attributes: ['id'],
            raw: true,
        });

        if (activeHabits.length === 0) return 0;

        const habitIds = activeHabits.map(h => h.id);

        const completedToday = await HabitLog.count({
            where: {
                habit_id: { [Op.in]: habitIds },
                execution_date: today,
                status: { [Op.in]: ['DONE', 'SKIPPED'] },
            },
        });

        return Math.max(0, activeHabits.length - completedToday);
    } catch {
        return 0;
    }
}

async function countPendingTasks(userId, today) {
    try {
        return await Task.count({
            where: {
                user_id: userId,
                status: { [Op.in]: ['BACKLOG', 'TODO', 'DOING'] },
                scheduled_date: { [Op.ne]: null, [Op.lte]: today },
            },
        });
    } catch {
        return 0;
    }
}

async function countPendingFinance(userId, today) {
    try {
        return await RecurringExpense.count({
            where: {
                user_id: userId,
                is_active: true,
                next_due_date: { [Op.ne]: null, [Op.lte]: today },
            },
        });
    } catch {
        return 0;
    }
}

async function countPendingHome(userId, today) {
    try {
        // Find user's spaces
        const spaces = await HomeSpace.findAll({
            where: { user_id: userId, is_active: true },
            attributes: ['id'],
            raw: true,
        });

        if (spaces.length === 0) return 0;

        const spaceIds = spaces.map(s => s.id);

        const [pendingTasks, overdueMaintenance] = await Promise.all([
            // Pending task occurrences
            HomeTaskOccurrence.count({
                where: {
                    status: 'PENDING',
                    due_date: { [Op.lte]: today },
                },
                include: [{
                    model: HomeTask,
                    as: 'task',
                    where: {
                        space_id: { [Op.in]: spaceIds },
                        is_active: true,
                    },
                    attributes: [],
                }],
            }),
            // Overdue maintenance
            HomeMaintenance.count({
                where: {
                    space_id: { [Op.in]: spaceIds },
                    is_active: true,
                    next_due_at: { [Op.ne]: null, [Op.lte]: today },
                },
            }),
        ]);

        return pendingTasks + overdueMaintenance;
    } catch {
        return 0;
    }
}

module.exports = { getNotificationCounts };
