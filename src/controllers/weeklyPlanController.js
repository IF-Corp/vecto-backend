const { WorkWeeklyPlan, WorkWeeklyPlanItem, WorkTask, WorkMeeting, sequelize } = require('../models');
const { Op } = require('sequelize');
const { format, startOfWeek, endOfWeek, addDays, eachDayOfInterval, differenceInMinutes } = require('date-fns');

// Get weekly meetings
const getWeeklyMeetings = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { weekStart } = request.query;

        const start = weekStart ? new Date(weekStart) : startOfWeek(new Date(), { weekStartsOn: 1 });
        const end = endOfWeek(start, { weekStartsOn: 1 });

        const meetings = await WorkMeeting.findAll({
            where: {
                userId,
                scheduledAt: {
                    [Op.between]: [start, end],
                },
            },
            order: [['scheduledAt', 'ASC']],
        });

        // Group by day
        const byDay = {};
        const days = eachDayOfInterval({ start, end });
        days.forEach(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            byDay[dateKey] = [];
        });

        meetings.forEach(meeting => {
            const dateKey = format(new Date(meeting.scheduledAt), 'yyyy-MM-dd');
            if (byDay[dateKey]) {
                byDay[dateKey].push(meeting);
            }
        });

        // Calculate total meeting hours
        let totalMinutes = 0;
        meetings.forEach(meeting => {
            totalMinutes += meeting.duration || 60;
        });

        return reply.send({
            meetings,
            byDay,
            totalHours: Math.round((totalMinutes / 60) * 10) / 10,
        });
    } catch (error) {
        console.error('Error fetching weekly meetings:', error);
        return reply.status(500).send({ error: 'Failed to fetch weekly meetings' });
    }
};

// Get weekly deadlines
const getWeeklyDeadlines = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { weekStart } = request.query;

        const start = weekStart ? new Date(weekStart) : startOfWeek(new Date(), { weekStartsOn: 1 });
        const end = endOfWeek(start, { weekStartsOn: 1 });

        const tasks = await WorkTask.findAll({
            where: {
                userId,
                completedAt: null,
                deadline: {
                    [Op.between]: [start, end],
                },
            },
            order: [['deadline', 'ASC'], ['priorityQuadrant', 'ASC']],
        });

        // Calculate total estimated hours
        let totalMinutes = 0;
        tasks.forEach(task => {
            totalMinutes += task.estimatedDuration || 60;
        });

        return reply.send({
            tasks,
            totalHours: Math.round((totalMinutes / 60) * 10) / 10,
            count: tasks.length,
        });
    } catch (error) {
        console.error('Error fetching weekly deadlines:', error);
        return reply.status(500).send({ error: 'Failed to fetch weekly deadlines' });
    }
};

// Calculate available hours for a week
const calculateAvailableHours = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { weekStart, workHoursPerDay = 8 } = request.query;

        const start = weekStart ? new Date(weekStart) : startOfWeek(new Date(), { weekStartsOn: 1 });
        const end = endOfWeek(start, { weekStartsOn: 1 });

        // Get meetings
        const meetings = await WorkMeeting.findAll({
            where: {
                userId,
                scheduledAt: {
                    [Op.between]: [start, end],
                },
            },
        });

        // Calculate total meeting minutes
        let meetingMinutes = 0;
        meetings.forEach(meeting => {
            meetingMinutes += meeting.duration || 60;
        });

        // Calculate work days (Mon-Fri)
        const workDays = 5;
        const availableHours = workDays * parseFloat(workHoursPerDay);
        const meetingHours = meetingMinutes / 60;
        const workHours = availableHours - meetingHours;

        return reply.send({
            availableHours,
            meetingHours: Math.round(meetingHours * 10) / 10,
            workHours: Math.round(workHours * 10) / 10,
            meetingPercentage: Math.round((meetingHours / availableHours) * 100),
        });
    } catch (error) {
        console.error('Error calculating available hours:', error);
        return reply.status(500).send({ error: 'Failed to calculate available hours' });
    }
};

// Get or create weekly plan
const getWeeklyPlan = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { weekStart } = request.query;

        const start = weekStart
            ? format(new Date(weekStart), 'yyyy-MM-dd')
            : format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const end = format(endOfWeek(new Date(start), { weekStartsOn: 1 }), 'yyyy-MM-dd');

        let plan = await WorkWeeklyPlan.findOne({
            where: { userId, weekStart: start },
            include: [
                {
                    model: WorkWeeklyPlanItem,
                    as: 'items',
                    include: [{ model: WorkTask, as: 'task' }],
                    order: [['priorityOrder', 'ASC']],
                },
            ],
        });

        if (!plan) {
            // Calculate hours
            const meetings = await WorkMeeting.findAll({
                where: {
                    userId,
                    scheduledAt: {
                        [Op.between]: [new Date(start), new Date(end)],
                    },
                },
            });

            let meetingMinutes = 0;
            meetings.forEach(m => {
                meetingMinutes += m.duration || 60;
            });

            const availableHours = 40;
            const meetingHours = meetingMinutes / 60;

            plan = await WorkWeeklyPlan.create({
                userId,
                weekStart: start,
                weekEnd: end,
                availableHours,
                meetingHours: Math.round(meetingHours * 100) / 100,
                workHours: Math.round((availableHours - meetingHours) * 100) / 100,
                estimatedHours: 0,
                status: 'draft',
            });

            plan = await WorkWeeklyPlan.findByPk(plan.id, {
                include: [
                    {
                        model: WorkWeeklyPlanItem,
                        as: 'items',
                        include: [{ model: WorkTask, as: 'task' }],
                    },
                ],
            });
        }

        return reply.send(plan);
    } catch (error) {
        console.error('Error fetching weekly plan:', error);
        return reply.status(500).send({ error: 'Failed to fetch weekly plan' });
    }
};

// Create or update weekly plan
const saveWeeklyPlan = async (request, reply) => {
    const transaction = await sequelize.transaction();

    try {
        const { userId } = request.params;
        const { weekStart, availableHours, notes, items, status } = request.body;

        const start = format(new Date(weekStart), 'yyyy-MM-dd');
        const end = format(endOfWeek(new Date(weekStart), { weekStartsOn: 1 }), 'yyyy-MM-dd');

        // Get or create plan
        let plan = await WorkWeeklyPlan.findOne({
            where: { userId, weekStart: start },
        });

        // Calculate meeting hours
        const meetings = await WorkMeeting.findAll({
            where: {
                userId,
                scheduledAt: {
                    [Op.between]: [new Date(start), new Date(end)],
                },
            },
        });

        let meetingMinutes = 0;
        meetings.forEach(m => {
            meetingMinutes += m.duration || 60;
        });

        const meetingHours = meetingMinutes / 60;
        const workHours = (availableHours || 40) - meetingHours;

        // Calculate estimated hours from items
        let estimatedHours = 0;
        if (items && items.length > 0) {
            items.forEach(item => {
                estimatedHours += parseFloat(item.estimatedHours || 0);
            });
        }

        if (plan) {
            await plan.update({
                availableHours: availableHours || 40,
                meetingHours: Math.round(meetingHours * 100) / 100,
                workHours: Math.round(workHours * 100) / 100,
                estimatedHours: Math.round(estimatedHours * 100) / 100,
                notes,
                status: status || plan.status,
            }, { transaction });

            // Delete existing items
            await WorkWeeklyPlanItem.destroy({
                where: { planId: plan.id },
                transaction,
            });
        } else {
            plan = await WorkWeeklyPlan.create({
                userId,
                weekStart: start,
                weekEnd: end,
                availableHours: availableHours || 40,
                meetingHours: Math.round(meetingHours * 100) / 100,
                workHours: Math.round(workHours * 100) / 100,
                estimatedHours: Math.round(estimatedHours * 100) / 100,
                notes,
                status: status || 'draft',
            }, { transaction });
        }

        // Create items
        if (items && items.length > 0) {
            const itemsData = items.map((item, index) => ({
                planId: plan.id,
                taskId: item.taskId || null,
                customTitle: item.customTitle || null,
                priorityOrder: item.priorityOrder ?? index,
                targetDay: item.targetDay || null,
                estimatedHours: item.estimatedHours || null,
                isCompleted: item.isCompleted || false,
            }));

            await WorkWeeklyPlanItem.bulkCreate(itemsData, { transaction });
        }

        await transaction.commit();

        // Fetch full plan
        const fullPlan = await WorkWeeklyPlan.findByPk(plan.id, {
            include: [
                {
                    model: WorkWeeklyPlanItem,
                    as: 'items',
                    include: [{ model: WorkTask, as: 'task' }],
                    order: [['priorityOrder', 'ASC']],
                },
            ],
        });

        return reply.send(fullPlan);
    } catch (error) {
        await transaction.rollback();
        console.error('Error saving weekly plan:', error);
        return reply.status(500).send({ error: 'Failed to save weekly plan' });
    }
};

// Update plan item order
const updateItemOrder = async (request, reply) => {
    try {
        const { planId } = request.params;
        const { items } = request.body;

        if (!items || !Array.isArray(items)) {
            return reply.status(400).send({ error: 'Items array required' });
        }

        for (const item of items) {
            await WorkWeeklyPlanItem.update(
                {
                    priorityOrder: item.priorityOrder,
                    targetDay: item.targetDay,
                },
                { where: { id: item.id, planId } }
            );
        }

        return reply.send({ success: true });
    } catch (error) {
        console.error('Error updating item order:', error);
        return reply.status(500).send({ error: 'Failed to update item order' });
    }
};

// Generate plan suggestions
const generatePlanSuggestions = async (request, reply) => {
    try {
        const { planId } = request.params;

        const plan = await WorkWeeklyPlan.findByPk(planId, {
            include: [
                {
                    model: WorkWeeklyPlanItem,
                    as: 'items',
                    include: [{ model: WorkTask, as: 'task' }],
                },
            ],
        });

        if (!plan) {
            return reply.status(404).send({ error: 'Plan not found' });
        }

        const suggestions = [];
        const workHours = parseFloat(plan.workHours);
        const estimatedHours = parseFloat(plan.estimatedHours);
        const deficit = estimatedHours - workHours;

        if (deficit > 0) {
            suggestions.push({
                type: 'warning',
                message: `Você tem ${deficit.toFixed(1)}h a mais de trabalho do que tempo disponível.`,
            });

            // Find lowest priority items that could be moved
            const lowPriorityItems = plan.items
                .filter(item => item.task && !item.task.deadline)
                .slice(-2);

            if (lowPriorityItems.length > 0) {
                suggestions.push({
                    type: 'suggestion',
                    message: `Considere mover "${lowPriorityItems[0]?.task?.title || lowPriorityItems[0]?.customTitle}" para a próxima semana.`,
                });
            }

            suggestions.push({
                type: 'suggestion',
                message: 'Ou reduza o escopo de algumas tarefas para caber no tempo disponível.',
            });
        }

        // Check for tasks without estimated time
        const noEstimate = plan.items.filter(item => !item.estimatedHours);
        if (noEstimate.length > 0) {
            suggestions.push({
                type: 'info',
                message: `${noEstimate.length} itens não têm estimativa de tempo. Adicione para melhor planejamento.`,
            });
        }

        // Check for high meeting days
        const meetingPercentage = (parseFloat(plan.meetingHours) / parseFloat(plan.availableHours)) * 100;
        if (meetingPercentage > 40) {
            suggestions.push({
                type: 'warning',
                message: `${Math.round(meetingPercentage)}% do seu tempo está em reuniões. Considere consolidar ou recusar algumas.`,
            });
        }

        return reply.send({
            suggestions,
            hasDeficit: deficit > 0,
            deficit: deficit > 0 ? deficit : 0,
        });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        return reply.status(500).send({ error: 'Failed to generate suggestions' });
    }
};

// Get plan history
const getPlanHistory = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { limit = 10 } = request.query;

        const plans = await WorkWeeklyPlan.findAll({
            where: { userId },
            order: [['weekStart', 'DESC']],
            limit: parseInt(limit),
        });

        return reply.send(plans);
    } catch (error) {
        console.error('Error fetching plan history:', error);
        return reply.status(500).send({ error: 'Failed to fetch plan history' });
    }
};

module.exports = {
    getWeeklyMeetings,
    getWeeklyDeadlines,
    calculateAvailableHours,
    getWeeklyPlan,
    saveWeeklyPlan,
    updateItemOrder,
    generatePlanSuggestions,
    getPlanHistory,
};
