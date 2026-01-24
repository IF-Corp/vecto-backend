const {
    Habit,
    Routine,
    RoutineItem,
    HabitLog,
    RoutineExecution,
    RoutineExecutionItem,
    SocialGroup,
    GroupMember
} = require('../models');
const { Op } = require('sequelize');

class HabitController {
    // ==================== HABITS ====================

    async getHabits(request, reply) {
        try {
            const { userId } = request.params;
            const { status = 'active' } = request.query;

            const whereClause = { user_id: userId };
            if (status !== 'all') {
                whereClause.status = status;
            }

            const habits = await Habit.findAll({
                where: whereClause,
                include: [{
                    model: HabitLog,
                    as: 'logs',
                    limit: 30,
                    order: [['execution_date', 'DESC']]
                }],
                order: [['created_at', 'DESC']]
            });

            return reply.send({ success: true, data: habits });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async createHabit(request, reply) {
        try {
            const { userId } = request.params;
            const {
                name,
                description,
                category,
                context_tags,
                ideal_time,
                time_period,
                frequency,
                frequency_days,
                estimated_duration
            } = request.body;

            if (!name) {
                return reply.status(400).send({ success: false, error: 'Name is required' });
            }

            const habit = await Habit.create({
                user_id: userId,
                name,
                description,
                category: category || 'Geral',
                context_tags: context_tags || [],
                ideal_time,
                time_period: time_period || 'anytime',
                frequency: frequency || 'DAILY',
                frequency_days: frequency_days || [],
                estimated_duration
            });

            return reply.status(201).send({ success: true, data: habit });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async updateHabit(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;
            const updates = request.body;

            const habit = await Habit.findByPk(id);
            if (!habit) {
                return reply.status(404).send({ success: false, error: 'Habit not found' });
            }

            // Verify ownership
            if (habit.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            await habit.update(updates);
            return reply.send({ success: true, data: habit });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async deleteHabit(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;

            const habit = await Habit.findByPk(id);
            if (!habit) {
                return reply.status(404).send({ success: false, error: 'Habit not found' });
            }

            // Verify ownership
            if (habit.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            await habit.destroy();
            return reply.send({ success: true, message: 'Habit deleted' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async archiveHabit(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;

            const habit = await Habit.findByPk(id);
            if (!habit) {
                return reply.status(404).send({ success: false, error: 'Habit not found' });
            }

            if (habit.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            await habit.update({ status: 'archived' });
            return reply.send({ success: true, data: habit });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async reactivateHabit(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;
            const { frequency, frequency_days } = request.body;

            const habit = await Habit.findByPk(id);
            if (!habit) {
                return reply.status(404).send({ success: false, error: 'Habit not found' });
            }

            if (habit.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            await habit.update({
                status: 'active',
                current_streak: 0,
                frequency: frequency || habit.frequency,
                frequency_days: frequency_days || habit.frequency_days
            });
            return reply.send({ success: true, data: habit });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async logHabit(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;
            const { status, execution_date } = request.body;

            if (!status) {
                return reply.status(400).send({ success: false, error: 'Status is required' });
            }

            const habit = await Habit.findByPk(id);
            if (!habit) {
                return reply.status(404).send({ success: false, error: 'Habit not found' });
            }

            if (habit.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            const logDate = execution_date ? new Date(execution_date) : new Date();

            // Check if already logged for this date
            const existingLog = await HabitLog.findOne({
                where: {
                    habit_id: id,
                    execution_date: {
                        [Op.gte]: new Date(logDate.setHours(0, 0, 0, 0)),
                        [Op.lt]: new Date(logDate.setHours(23, 59, 59, 999))
                    }
                }
            });

            if (existingLog) {
                await existingLog.update({ status });
            } else {
                await HabitLog.create({
                    habit_id: id,
                    status,
                    execution_date: execution_date || new Date()
                });
            }

            // Update streak
            if (status === 'DONE') {
                const newStreak = habit.current_streak + 1;
                const bestStreak = Math.max(habit.best_streak, newStreak);
                await habit.update({
                    current_streak: newStreak,
                    best_streak: bestStreak
                });
            } else if (status === 'FAILED') {
                await habit.update({ current_streak: 0 });
            }

            const updatedHabit = await Habit.findByPk(id, {
                include: [{ model: HabitLog, as: 'logs', limit: 30, order: [['execution_date', 'DESC']] }]
            });

            return reply.status(201).send({ success: true, data: updatedHabit });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    // ==================== ROUTINES ====================

    async getRoutines(request, reply) {
        try {
            const { userId } = request.params;
            const { status = 'active' } = request.query;

            const whereClause = { user_id: userId };
            if (status !== 'all') {
                whereClause.status = status;
            }

            const routines = await Routine.findAll({
                where: whereClause,
                include: [
                    {
                        model: RoutineItem,
                        as: 'items',
                        order: [['item_order', 'ASC']]
                    },
                    {
                        model: RoutineExecution,
                        as: 'executions',
                        limit: 10,
                        order: [['started_at', 'DESC']],
                        include: [{
                            model: RoutineExecutionItem,
                            as: 'itemTimes'
                        }]
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return reply.send({ success: true, data: routines });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async createRoutine(request, reply) {
        try {
            const { userId } = request.params;
            const { name, start_time, frequency, frequency_days, items } = request.body;

            if (!name) {
                return reply.status(400).send({ success: false, error: 'Name is required' });
            }

            const routine = await Routine.create({
                user_id: userId,
                name,
                start_time,
                frequency: frequency || 'DAILY',
                frequency_days: frequency_days || []
            });

            // Create items if provided
            if (items && items.length > 0) {
                const routineItems = items.map((item, index) => ({
                    routine_id: routine.id,
                    title: item.title,
                    estimated_duration: item.duration || item.estimated_duration,
                    item_order: index
                }));
                await RoutineItem.bulkCreate(routineItems);
            }

            // Fetch the complete routine with items
            const completeRoutine = await Routine.findByPk(routine.id, {
                include: [{
                    model: RoutineItem,
                    as: 'items',
                    order: [['item_order', 'ASC']]
                }]
            });

            return reply.status(201).send({ success: true, data: completeRoutine });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async updateRoutine(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;
            const { items, ...updates } = request.body;

            const routine = await Routine.findByPk(id);
            if (!routine) {
                return reply.status(404).send({ success: false, error: 'Routine not found' });
            }

            if (routine.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            await routine.update(updates);

            // Update items if provided
            if (items) {
                await RoutineItem.destroy({ where: { routine_id: id } });
                const routineItems = items.map((item, index) => ({
                    routine_id: id,
                    title: item.title,
                    estimated_duration: item.duration || item.estimated_duration,
                    item_order: index
                }));
                await RoutineItem.bulkCreate(routineItems);
            }

            // Fetch the complete routine with items
            const completeRoutine = await Routine.findByPk(id, {
                include: [{
                    model: RoutineItem,
                    as: 'items',
                    order: [['item_order', 'ASC']]
                }]
            });

            return reply.send({ success: true, data: completeRoutine });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async deleteRoutine(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;

            const routine = await Routine.findByPk(id);
            if (!routine) {
                return reply.status(404).send({ success: false, error: 'Routine not found' });
            }

            if (routine.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            await routine.destroy();
            return reply.send({ success: true, message: 'Routine deleted' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async archiveRoutine(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;

            const routine = await Routine.findByPk(id);
            if (!routine) {
                return reply.status(404).send({ success: false, error: 'Routine not found' });
            }

            if (routine.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            await routine.update({ status: 'archived' });
            return reply.send({ success: true, data: routine });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async logRoutineExecution(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;
            const {
                started_at,
                completed_at,
                total_duration,
                completed,
                item_times
            } = request.body;

            const routine = await Routine.findByPk(id, {
                include: [{ model: RoutineItem, as: 'items' }]
            });

            if (!routine) {
                return reply.status(404).send({ success: false, error: 'Routine not found' });
            }

            if (routine.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            // Create execution record
            const execution = await RoutineExecution.create({
                routine_id: id,
                execution_date: new Date(started_at).toISOString().split('T')[0],
                started_at,
                completed_at,
                total_duration,
                completed: completed || false
            });

            // Create item time records
            if (item_times && item_times.length > 0) {
                const itemTimeRecords = item_times.map(it => ({
                    execution_id: execution.id,
                    item_id: it.item_id,
                    item_title: it.item_title,
                    duration: it.duration
                }));
                await RoutineExecutionItem.bulkCreate(itemTimeRecords);
            }

            // Update streak if completed
            if (completed) {
                const newStreak = routine.current_streak + 1;
                const bestStreak = Math.max(routine.best_streak, newStreak);

                // Calculate new average duration
                const executions = await RoutineExecution.findAll({
                    where: { routine_id: id, completed: true },
                    order: [['started_at', 'DESC']],
                    limit: 7
                });

                const avgDuration = executions.length > 0
                    ? Math.round(executions.reduce((sum, e) => sum + (e.total_duration || 0), 0) / executions.length)
                    : total_duration;

                await routine.update({
                    current_streak: newStreak,
                    best_streak: bestStreak,
                    average_duration: avgDuration
                });
            }

            // Fetch complete execution with item times
            const completeExecution = await RoutineExecution.findByPk(execution.id, {
                include: [{ model: RoutineExecutionItem, as: 'itemTimes' }]
            });

            return reply.status(201).send({ success: true, data: completeExecution });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async getRoutineHistory(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;
            const { limit = 30 } = request.query;

            const routine = await Routine.findByPk(id);
            if (!routine) {
                return reply.status(404).send({ success: false, error: 'Routine not found' });
            }

            if (routine.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            const executions = await RoutineExecution.findAll({
                where: { routine_id: id },
                include: [{ model: RoutineExecutionItem, as: 'itemTimes' }],
                order: [['started_at', 'DESC']],
                limit: parseInt(limit)
            });

            return reply.send({ success: true, data: executions });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    // ==================== FOCUS MODE SESSIONS ====================

    async startFocusSession(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user.id;

            const routine = await Routine.findByPk(id, {
                include: [{ model: RoutineItem, as: 'items' }]
            });

            if (!routine) {
                return reply.status(404).send({ success: false, error: 'Routine not found' });
            }

            if (routine.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            // Check for existing active session for this user
            const existingSession = await RoutineExecution.findOne({
                where: {
                    status: { [Op.in]: ['in_progress', 'paused'] }
                },
                include: [{
                    model: Routine,
                    as: 'routine',
                    where: { user_id: userId }
                }]
            });

            if (existingSession) {
                return reply.status(409).send({
                    success: false,
                    error: 'Active session exists',
                    activeSession: existingSession
                });
            }

            const now = new Date();
            const execution = await RoutineExecution.create({
                routine_id: id,
                execution_date: now.toISOString().split('T')[0],
                started_at: now,
                status: 'in_progress',
                completed: false,
                paused_duration: 0
            });

            const completeExecution = await RoutineExecution.findByPk(execution.id, {
                include: [{ model: RoutineExecutionItem, as: 'itemTimes' }]
            });

            return reply.status(201).send({ success: true, data: completeExecution });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async pauseFocusSession(request, reply) {
        try {
            const { id, executionId } = request.params;
            const userId = request.user.id;

            const execution = await RoutineExecution.findByPk(executionId, {
                include: [{ model: Routine, as: 'routine' }]
            });

            if (!execution) {
                return reply.status(404).send({ success: false, error: 'Execution not found' });
            }

            if (execution.routine.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            if (execution.status !== 'in_progress') {
                return reply.status(400).send({ success: false, error: 'Session is not in progress' });
            }

            await execution.update({
                status: 'paused',
                paused_at: new Date()
            });

            return reply.send({ success: true, data: execution });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async resumeFocusSession(request, reply) {
        try {
            const { id, executionId } = request.params;
            const userId = request.user.id;

            const execution = await RoutineExecution.findByPk(executionId, {
                include: [{ model: Routine, as: 'routine' }]
            });

            if (!execution) {
                return reply.status(404).send({ success: false, error: 'Execution not found' });
            }

            if (execution.routine.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            if (execution.status !== 'paused') {
                return reply.status(400).send({ success: false, error: 'Session is not paused' });
            }

            // Calculate paused time and add to accumulated paused_duration
            const pausedAt = new Date(execution.paused_at);
            const now = new Date();
            const pausedSeconds = Math.floor((now - pausedAt) / 1000);

            await execution.update({
                status: 'in_progress',
                paused_duration: execution.paused_duration + pausedSeconds,
                paused_at: null
            });

            return reply.send({ success: true, data: execution });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async completeFocusSession(request, reply) {
        try {
            const { id, executionId } = request.params;
            const userId = request.user.id;
            const { item_times } = request.body;

            const execution = await RoutineExecution.findByPk(executionId, {
                include: [{ model: Routine, as: 'routine' }]
            });

            if (!execution) {
                return reply.status(404).send({ success: false, error: 'Execution not found' });
            }

            if (execution.routine.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            const routine = execution.routine;
            const now = new Date();
            const startedAt = new Date(execution.started_at);
            const totalSeconds = Math.floor((now - startedAt) / 1000) - execution.paused_duration;

            await execution.update({
                status: 'completed',
                completed: true,
                completed_at: now,
                total_duration: totalSeconds,
                paused_at: null
            });

            // Create item time records
            if (item_times && item_times.length > 0) {
                await RoutineExecutionItem.destroy({ where: { execution_id: executionId } });
                const itemTimeRecords = item_times.map(it => ({
                    execution_id: executionId,
                    item_id: it.item_id,
                    item_title: it.item_title,
                    duration: it.duration
                }));
                await RoutineExecutionItem.bulkCreate(itemTimeRecords);
            }

            // Update streak and average
            const newStreak = routine.current_streak + 1;
            const bestStreak = Math.max(routine.best_streak, newStreak);

            const executions = await RoutineExecution.findAll({
                where: { routine_id: id, completed: true },
                order: [['started_at', 'DESC']],
                limit: 7
            });

            const avgDuration = executions.length > 0
                ? Math.round(executions.reduce((sum, e) => sum + (e.total_duration || 0), 0) / executions.length)
                : totalSeconds;

            await routine.update({
                current_streak: newStreak,
                best_streak: bestStreak,
                average_duration: avgDuration
            });

            const completeExecution = await RoutineExecution.findByPk(executionId, {
                include: [{ model: RoutineExecutionItem, as: 'itemTimes' }]
            });

            return reply.send({ success: true, data: completeExecution });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async cancelFocusSession(request, reply) {
        try {
            const { id, executionId } = request.params;
            const userId = request.user.id;
            const { item_times } = request.body;

            const execution = await RoutineExecution.findByPk(executionId, {
                include: [{ model: Routine, as: 'routine' }]
            });

            if (!execution) {
                return reply.status(404).send({ success: false, error: 'Execution not found' });
            }

            if (execution.routine.user_id !== userId) {
                return reply.status(403).send({ success: false, error: 'Not authorized' });
            }

            const now = new Date();
            const startedAt = new Date(execution.started_at);
            let totalSeconds = Math.floor((now - startedAt) / 1000) - execution.paused_duration;

            // If paused, add current pause time
            if (execution.status === 'paused' && execution.paused_at) {
                const pausedAt = new Date(execution.paused_at);
                totalSeconds -= Math.floor((now - pausedAt) / 1000);
            }

            await execution.update({
                status: 'cancelled',
                completed: false,
                completed_at: now,
                total_duration: totalSeconds,
                paused_at: null
            });

            // Save partial item times if provided
            if (item_times && item_times.length > 0) {
                await RoutineExecutionItem.destroy({ where: { execution_id: executionId } });
                const itemTimeRecords = item_times.map(it => ({
                    execution_id: executionId,
                    item_id: it.item_id,
                    item_title: it.item_title,
                    duration: it.duration
                }));
                await RoutineExecutionItem.bulkCreate(itemTimeRecords);
            }

            return reply.send({ success: true, data: execution });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async getActiveSession(request, reply) {
        try {
            const { userId } = request.params;

            const activeSession = await RoutineExecution.findOne({
                where: {
                    status: { [Op.in]: ['in_progress', 'paused'] }
                },
                include: [
                    {
                        model: Routine,
                        as: 'routine',
                        where: { user_id: userId },
                        include: [{ model: RoutineItem, as: 'items' }]
                    },
                    { model: RoutineExecutionItem, as: 'itemTimes' }
                ]
            });

            return reply.send({ success: true, data: activeSession });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async getFocusStats(request, reply) {
        try {
            const { userId } = request.params;

            // Get all completed executions for this user
            const executions = await RoutineExecution.findAll({
                where: {
                    status: 'completed',
                    completed: true
                },
                include: [{
                    model: Routine,
                    as: 'routine',
                    where: { user_id: userId }
                }]
            });

            // Calculate stats
            const totalTimeAllTime = executions.reduce((sum, e) => sum + (e.total_duration || 0), 0);
            const completedSessionsCount = executions.length;

            // This week's stats
            const startOfWeek = new Date();
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

            const thisWeekExecutions = executions.filter(e =>
                new Date(e.started_at) >= startOfWeek
            );
            const totalTimeThisWeek = thisWeekExecutions.reduce((sum, e) => sum + (e.total_duration || 0), 0);

            const avgDuration = completedSessionsCount > 0
                ? Math.round(totalTimeAllTime / completedSessionsCount)
                : 0;

            return reply.send({
                success: true,
                data: {
                    total_time_all_time: totalTimeAllTime,
                    total_time_this_week: totalTimeThisWeek,
                    completed_sessions_count: completedSessionsCount,
                    average_duration: avgDuration
                }
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    // ==================== SOCIAL GROUPS ====================

    async getSocialGroups(request, reply) {
        try {
            const groups = await SocialGroup.findAll({
                include: [{
                    model: GroupMember,
                    as: 'members',
                    attributes: ['user_id', 'current_score']
                }]
            });

            return reply.send({ success: true, data: groups });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async createSocialGroup(request, reply) {
        try {
            const { name, ranking_logic } = request.body;

            if (!name) {
                return reply.status(400).send({ success: false, error: 'Name is required' });
            }

            const group = await SocialGroup.create({
                name,
                ranking_logic: ranking_logic || 'POINTS'
            });

            return reply.status(201).send({ success: true, data: group });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async joinGroup(request, reply) {
        try {
            const { id } = request.params;
            const { user_id } = request.body;

            if (!user_id) {
                return reply.status(400).send({ success: false, error: 'user_id is required' });
            }

            const [member, created] = await GroupMember.findOrCreate({
                where: { group_id: id, user_id },
                defaults: { group_id: id, user_id, current_score: 0 }
            });

            return reply.status(created ? 201 : 200).send({
                success: true,
                data: member,
                created
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async leaveGroup(request, reply) {
        try {
            const { id } = request.params;
            const { user_id } = request.body;

            const member = await GroupMember.findOne({
                where: { group_id: id, user_id }
            });

            if (!member) {
                return reply.status(404).send({ success: false, error: 'Member not found' });
            }

            await member.destroy();
            return reply.send({ success: true, message: 'Left group' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async getGroupRanking(request, reply) {
        try {
            const { id } = request.params;

            const members = await GroupMember.findAll({
                where: { group_id: id },
                order: [['current_score', 'DESC']],
                include: [{ model: require('../models').User, as: 'user', attributes: ['id', 'name', 'avatar_url'] }]
            });

            return reply.send({ success: true, data: members });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }
}

module.exports = new HabitController();
