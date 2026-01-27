const {
    WorkProfile,
    WorkTaskType,
    WorkTaskStatus,
    WorkProject,
    WorkTask,
    WorkTimeEntry,
    WorkClient,
    WorkProjectMember,
    WorkProjectMilestone,
} = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// ==================== WORK PROFILE ====================

const getWorkProfile = async (request, reply) => {
    try {
        const { userId } = request.params;
        let profile = await WorkProfile.findOne({
            where: { user_id: userId },
        });

        if (!profile) {
            // Create default profile if doesn't exist
            profile = await WorkProfile.create({
                user_id: userId,
            });
        }

        return { success: true, data: profile };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateWorkProfile = async (request, reply) => {
    try {
        const { userId } = request.params;
        let profile = await WorkProfile.findOne({
            where: { user_id: userId },
        });

        if (!profile) {
            profile = await WorkProfile.create({
                ...request.body,
                user_id: userId,
            });
            reply.status(201);
            return { success: true, data: profile, created: true };
        }

        await profile.update(request.body);
        return { success: true, data: profile };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== TASK TYPES ====================

const getTaskTypes = async (request, reply) => {
    try {
        const { userId } = request.params;
        const types = await WorkTaskType.findAll({
            where: {
                [Op.or]: [
                    { user_id: null, is_default: true },
                    { user_id: userId },
                ],
                is_active: true,
            },
            order: [['is_default', 'DESC'], ['name', 'ASC']],
        });
        return { success: true, data: types };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createTaskType = async (request, reply) => {
    try {
        const { userId } = request.params;
        const type = await WorkTaskType.create({
            ...request.body,
            user_id: userId,
            is_default: false,
        });
        reply.status(201);
        return { success: true, data: type, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateTaskType = async (request, reply) => {
    try {
        const { id, userId } = request.params;
        const type = await WorkTaskType.findOne({
            where: { id, user_id: userId },
        });

        if (!type) {
            reply.status(404);
            return { success: false, error: 'Task type not found' };
        }

        await type.update(request.body);
        return { success: true, data: type };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteTaskType = async (request, reply) => {
    try {
        const { id, userId } = request.params;
        const type = await WorkTaskType.findOne({
            where: { id, user_id: userId, is_default: false },
        });

        if (!type) {
            reply.status(404);
            return { success: false, error: 'Task type not found or cannot be deleted' };
        }

        await type.update({ is_active: false });
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== TASK STATUSES ====================

const getTaskStatuses = async (request, reply) => {
    try {
        const { userId } = request.params;
        const statuses = await WorkTaskStatus.findAll({
            where: {
                [Op.or]: [
                    { user_id: null, is_default: true },
                    { user_id: userId },
                ],
            },
            order: [['order', 'ASC']],
        });
        return { success: true, data: statuses };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createTaskStatus = async (request, reply) => {
    try {
        const { userId } = request.params;

        // Get max order
        const maxOrder = await WorkTaskStatus.max('order', {
            where: {
                [Op.or]: [
                    { user_id: null },
                    { user_id: userId },
                ],
            },
        });

        const status = await WorkTaskStatus.create({
            ...request.body,
            user_id: userId,
            is_default: false,
            order: (maxOrder || 0) + 1,
        });
        reply.status(201);
        return { success: true, data: status, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateTaskStatus = async (request, reply) => {
    try {
        const { id, userId } = request.params;
        const status = await WorkTaskStatus.findOne({
            where: { id, user_id: userId },
        });

        if (!status) {
            reply.status(404);
            return { success: false, error: 'Task status not found' };
        }

        await status.update(request.body);
        return { success: true, data: status };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const reorderTaskStatuses = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { statusOrders } = request.body; // Array of { id, order }

        for (const item of statusOrders) {
            await WorkTaskStatus.update(
                { order: item.order },
                { where: { id: item.id, user_id: userId } }
            );
        }

        const statuses = await WorkTaskStatus.findAll({
            where: {
                [Op.or]: [
                    { user_id: null, is_default: true },
                    { user_id: userId },
                ],
            },
            order: [['order', 'ASC']],
        });

        return { success: true, data: statuses };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteTaskStatus = async (request, reply) => {
    try {
        const { id, userId } = request.params;
        const status = await WorkTaskStatus.findOne({
            where: { id, user_id: userId, is_default: false },
        });

        if (!status) {
            reply.status(404);
            return { success: false, error: 'Task status not found or cannot be deleted' };
        }

        await status.destroy();
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== PROJECTS ====================

const getProjects = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { status } = request.query;

        const where = { user_id: userId };
        if (status) {
            where.status = status;
        }

        const projects = await WorkProject.findAll({
            where,
            include: [
                {
                    association: 'tasks',
                    attributes: ['id', 'status_id', 'estimated_hours', 'actual_hours'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        // Calculate stats for each project
        const projectsWithStats = projects.map((project) => {
            const tasks = project.tasks || [];
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter((t) => t.status_id === 'c0000000-0000-0000-0000-000000000004').length;
            const totalEstimatedHours = tasks.reduce((sum, t) => sum + (parseFloat(t.estimated_hours) || 0), 0);
            const totalActualHours = tasks.reduce((sum, t) => sum + (parseFloat(t.actual_hours) || 0), 0);

            return {
                ...project.toJSON(),
                stats: {
                    totalTasks,
                    completedTasks,
                    progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
                    totalEstimatedHours,
                    totalActualHours,
                },
            };
        });

        return { success: true, data: projectsWithStats };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getProject = async (request, reply) => {
    try {
        const { id } = request.params;
        const project = await WorkProject.findByPk(id, {
            include: [
                {
                    association: 'tasks',
                    include: [
                        { association: 'type' },
                        { association: 'status' },
                    ],
                },
                { association: 'timeEntries' },
            ],
        });

        if (!project) {
            reply.status(404);
            return { success: false, error: 'Project not found' };
        }

        return { success: true, data: project };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createProject = async (request, reply) => {
    try {
        const { userId } = request.params;
        const project = await WorkProject.create({
            ...request.body,
            user_id: userId,
        });
        reply.status(201);
        return { success: true, data: project, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateProject = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await WorkProject.update(request.body, {
            where: { id },
        });

        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Project not found' };
        }

        const project = await WorkProject.findByPk(id);
        return { success: true, data: project };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteProject = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await WorkProject.destroy({ where: { id } });

        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Project not found' };
        }

        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== TASKS ====================

const getTasks = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { projectId, typeId, statusId, priorityQuadrant, deadline, scheduledDate } = request.query;

        const where = { user_id: userId };

        if (projectId) where.project_id = projectId;
        if (typeId) where.type_id = typeId;
        if (statusId) where.status_id = statusId;
        if (priorityQuadrant) where.priority_quadrant = priorityQuadrant;

        if (deadline) {
            where.deadline = { [Op.lte]: new Date(deadline) };
        }

        if (scheduledDate) {
            where.scheduled_date = scheduledDate;
        }

        const tasks = await WorkTask.findAll({
            where,
            include: [
                { association: 'project', attributes: ['id', 'name', 'color'] },
                { association: 'type', attributes: ['id', 'name', 'icon', 'color'] },
                { association: 'status', attributes: ['id', 'name', 'color', 'is_done_status'] },
            ],
            order: [
                ['priority_quadrant', 'ASC'],
                ['deadline', 'ASC'],
                ['created_at', 'DESC'],
            ],
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
        const task = await WorkTask.findByPk(id, {
            include: [
                { association: 'project' },
                { association: 'type' },
                { association: 'status' },
                { association: 'timeEntries' },
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
        const { userId } = request.params;

        // Set default status if not provided
        let statusId = request.body.statusId;
        if (!statusId) {
            const defaultStatus = await WorkTaskStatus.findOne({
                where: { name: 'To Do', is_default: true },
            });
            statusId = defaultStatus?.id;
        }

        const task = await WorkTask.create({
            ...request.body,
            user_id: userId,
            status_id: statusId,
        });

        const taskWithRelations = await WorkTask.findByPk(task.id, {
            include: [
                { association: 'project', attributes: ['id', 'name', 'color'] },
                { association: 'type', attributes: ['id', 'name', 'icon', 'color'] },
                { association: 'status', attributes: ['id', 'name', 'color', 'is_done_status'] },
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
        const task = await WorkTask.findByPk(id);

        if (!task) {
            reply.status(404);
            return { success: false, error: 'Task not found' };
        }

        // Check if moving to done status
        if (request.body.statusId) {
            const newStatus = await WorkTaskStatus.findByPk(request.body.statusId);
            if (newStatus?.is_done_status && !task.completed_at) {
                request.body.completed_at = new Date();
            }
        }

        await task.update(request.body);

        const taskWithRelations = await WorkTask.findByPk(id, {
            include: [
                { association: 'project', attributes: ['id', 'name', 'color'] },
                { association: 'type', attributes: ['id', 'name', 'icon', 'color'] },
                { association: 'status', attributes: ['id', 'name', 'color', 'is_done_status'] },
            ],
        });

        return { success: true, data: taskWithRelations };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteTask = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await WorkTask.destroy({ where: { id } });

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

// ==================== TIME ENTRIES ====================

const getTimeEntries = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { taskId, projectId, startDate, endDate } = request.query;

        const where = { user_id: userId };

        if (taskId) where.task_id = taskId;
        if (projectId) where.project_id = projectId;

        if (startDate || endDate) {
            where.started_at = {};
            if (startDate) where.started_at[Op.gte] = new Date(startDate);
            if (endDate) where.started_at[Op.lte] = new Date(endDate);
        }

        const entries = await WorkTimeEntry.findAll({
            where,
            include: [
                { association: 'task', attributes: ['id', 'title'] },
                { association: 'project', attributes: ['id', 'name', 'color'] },
            ],
            order: [['started_at', 'DESC']],
        });

        return { success: true, data: entries };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createTimeEntry = async (request, reply) => {
    try {
        const { userId } = request.params;
        const entry = await WorkTimeEntry.create({
            ...request.body,
            user_id: userId,
        });

        // Update task actual_hours if task_id is provided
        if (entry.task_id && entry.duration_minutes) {
            const task = await WorkTask.findByPk(entry.task_id);
            if (task) {
                const newActualHours = (parseFloat(task.actual_hours) || 0) + (entry.duration_minutes / 60);
                await task.update({ actual_hours: newActualHours });
            }
        }

        reply.status(201);
        return { success: true, data: entry, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateTimeEntry = async (request, reply) => {
    try {
        const { id } = request.params;
        const entry = await WorkTimeEntry.findByPk(id);

        if (!entry) {
            reply.status(404);
            return { success: false, error: 'Time entry not found' };
        }

        const oldDuration = entry.duration_minutes;
        await entry.update(request.body);

        // Update task actual_hours if duration changed
        if (entry.task_id && entry.duration_minutes !== oldDuration) {
            const task = await WorkTask.findByPk(entry.task_id);
            if (task) {
                const diff = (entry.duration_minutes - (oldDuration || 0)) / 60;
                const newActualHours = Math.max(0, (parseFloat(task.actual_hours) || 0) + diff);
                await task.update({ actual_hours: newActualHours });
            }
        }

        return { success: true, data: entry };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteTimeEntry = async (request, reply) => {
    try {
        const { id } = request.params;
        const entry = await WorkTimeEntry.findByPk(id);

        if (!entry) {
            reply.status(404);
            return { success: false, error: 'Time entry not found' };
        }

        // Update task actual_hours
        if (entry.task_id && entry.duration_minutes) {
            const task = await WorkTask.findByPk(entry.task_id);
            if (task) {
                const newActualHours = Math.max(0, (parseFloat(task.actual_hours) || 0) - (entry.duration_minutes / 60));
                await task.update({ actual_hours: newActualHours });
            }
        }

        await entry.destroy();
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const startTimer = async (request, reply) => {
    try {
        const { userId } = request.params;

        // Stop any running timer first
        await WorkTimeEntry.update(
            {
                is_running: false,
                ended_at: new Date(),
            },
            {
                where: { user_id: userId, is_running: true },
            }
        );

        const entry = await WorkTimeEntry.create({
            ...request.body,
            user_id: userId,
            started_at: new Date(),
            is_running: true,
        });

        reply.status(201);
        return { success: true, data: entry, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const stopTimer = async (request, reply) => {
    try {
        const { userId } = request.params;

        const entry = await WorkTimeEntry.findOne({
            where: { user_id: userId, is_running: true },
        });

        if (!entry) {
            reply.status(404);
            return { success: false, error: 'No running timer found' };
        }

        const endedAt = new Date();
        const durationMinutes = Math.round((endedAt - entry.started_at) / 60000);

        await entry.update({
            ended_at: endedAt,
            duration_minutes: durationMinutes,
            is_running: false,
        });

        // Update task actual_hours
        if (entry.task_id) {
            const task = await WorkTask.findByPk(entry.task_id);
            if (task) {
                const newActualHours = (parseFloat(task.actual_hours) || 0) + (durationMinutes / 60);
                await task.update({ actual_hours: newActualHours });
            }
        }

        return { success: true, data: entry };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getRunningTimer = async (request, reply) => {
    try {
        const { userId } = request.params;

        const entry = await WorkTimeEntry.findOne({
            where: { user_id: userId, is_running: true },
            include: [
                { association: 'task', attributes: ['id', 'title'] },
                { association: 'project', attributes: ['id', 'name', 'color'] },
            ],
        });

        return { success: true, data: entry };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== ESTIMATION ACCURACY ====================

const getEstimationAccuracy = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { limit = 20 } = request.query;

        // Get completed tasks with both estimated and actual hours
        const completedTasks = await WorkTask.findAll({
            where: {
                user_id: userId,
                completed_at: { [Op.not]: null },
                estimated_hours: { [Op.not]: null },
                actual_hours: { [Op.gt]: 0 },
            },
            include: [
                { association: 'type', attributes: ['id', 'name', 'icon', 'color'] },
            ],
            order: [['completed_at', 'DESC']],
            limit: parseInt(limit),
        });

        if (completedTasks.length === 0) {
            return {
                success: true,
                data: {
                    averageAccuracy: null,
                    tendency: null,
                    byType: [],
                    tasks: [],
                },
            };
        }

        // Calculate accuracy for each task
        const tasksWithAccuracy = completedTasks.map((task) => {
            const estimated = parseFloat(task.estimated_hours);
            const actual = parseFloat(task.actual_hours);
            const accuracy = Math.min(100, Math.round((Math.min(estimated, actual) / Math.max(estimated, actual)) * 100));
            const diff = actual - estimated;

            return {
                id: task.id,
                title: task.title,
                type: task.type,
                estimated,
                actual,
                accuracy,
                diff,
            };
        });

        // Calculate overall average accuracy
        const averageAccuracy = Math.round(
            tasksWithAccuracy.reduce((sum, t) => sum + t.accuracy, 0) / tasksWithAccuracy.length
        );

        // Calculate tendency (underestimate vs overestimate)
        const totalDiff = tasksWithAccuracy.reduce((sum, t) => sum + t.diff, 0);
        const avgDiff = totalDiff / tasksWithAccuracy.length;
        let tendency;
        if (Math.abs(avgDiff) < 0.5) {
            tendency = { type: 'accurate', message: 'Suas estimativas são precisas!' };
        } else if (avgDiff > 0) {
            tendency = {
                type: 'underestimate',
                message: `Você subestima em ~${Math.round(avgDiff * 60)} minutos`,
                multiplier: 1 + (avgDiff / (tasksWithAccuracy.reduce((sum, t) => sum + t.estimated, 0) / tasksWithAccuracy.length)),
            };
        } else {
            tendency = {
                type: 'overestimate',
                message: `Você superestima em ~${Math.round(Math.abs(avgDiff) * 60)} minutos`,
                multiplier: 1 + (avgDiff / (tasksWithAccuracy.reduce((sum, t) => sum + t.estimated, 0) / tasksWithAccuracy.length)),
            };
        }

        // Calculate accuracy by type
        const typeAccuracy = {};
        tasksWithAccuracy.forEach((task) => {
            if (task.type) {
                const typeId = task.type.id;
                if (!typeAccuracy[typeId]) {
                    typeAccuracy[typeId] = {
                        type: task.type,
                        accuracies: [],
                        totalEstimated: 0,
                        totalActual: 0,
                    };
                }
                typeAccuracy[typeId].accuracies.push(task.accuracy);
                typeAccuracy[typeId].totalEstimated += task.estimated;
                typeAccuracy[typeId].totalActual += task.actual;
            }
        });

        const byType = Object.values(typeAccuracy).map((data) => ({
            type: data.type,
            averageAccuracy: Math.round(data.accuracies.reduce((a, b) => a + b, 0) / data.accuracies.length),
            taskCount: data.accuracies.length,
            multiplier: data.totalActual / data.totalEstimated,
        }));

        return {
            success: true,
            data: {
                averageAccuracy,
                tendency,
                byType,
                tasks: tasksWithAccuracy.slice(0, 10),
            },
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const suggestEstimate = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { typeId, title } = request.query;

        if (!typeId) {
            return { success: true, data: { suggestedHours: null } };
        }

        // Get average actual hours for similar tasks
        const similarTasks = await WorkTask.findAll({
            where: {
                user_id: userId,
                type_id: typeId,
                completed_at: { [Op.not]: null },
                actual_hours: { [Op.gt]: 0 },
            },
            attributes: ['actual_hours'],
            limit: 10,
            order: [['completed_at', 'DESC']],
        });

        if (similarTasks.length === 0) {
            return { success: true, data: { suggestedHours: null } };
        }

        const avgHours = similarTasks.reduce((sum, t) => sum + parseFloat(t.actual_hours), 0) / similarTasks.length;

        return {
            success: true,
            data: {
                suggestedHours: Math.round(avgHours * 10) / 10,
                basedOn: similarTasks.length,
            },
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== CLIENTS ====================

const getClients = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { status } = request.query;

        const where = { user_id: userId };
        if (status) {
            where.contract_status = status;
        }

        const clients = await WorkClient.findAll({
            where,
            include: [
                {
                    association: 'projects',
                    attributes: ['id', 'name', 'status', 'budget_hours', 'budget_value'],
                },
            ],
            order: [['name', 'ASC']],
        });

        // Calculate stats for each client
        const clientsWithStats = await Promise.all(clients.map(async (client) => {
            const projects = client.projects || [];
            const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;

            // Get total hours worked for this client
            const totalHours = await WorkTimeEntry.sum('duration_minutes', {
                where: {
                    user_id: userId,
                    project_id: { [Op.in]: projects.map(p => p.id) },
                },
            });

            // Get total budget value
            const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget_value) || 0), 0);

            return {
                ...client.toJSON(),
                stats: {
                    totalProjects: projects.length,
                    activeProjects,
                    totalHours: Math.round((totalHours || 0) / 60 * 10) / 10,
                    totalBudget,
                },
            };
        }));

        return { success: true, data: clientsWithStats };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getClient = async (request, reply) => {
    try {
        const { id } = request.params;
        const client = await WorkClient.findByPk(id, {
            include: [
                {
                    association: 'projects',
                    include: [
                        { association: 'tasks', attributes: ['id', 'status_id', 'estimated_hours', 'actual_hours'] },
                        { association: 'timeEntries', attributes: ['id', 'duration_minutes', 'is_billable'] },
                    ],
                },
            ],
        });

        if (!client) {
            reply.status(404);
            return { success: false, error: 'Client not found' };
        }

        return { success: true, data: client };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getClientDetails = async (request, reply) => {
    try {
        const { id } = request.params;
        const client = await WorkClient.findByPk(id, {
            include: [
                {
                    association: 'projects',
                    include: [
                        { association: 'tasks', attributes: ['id', 'status_id', 'estimated_hours', 'actual_hours', 'completed_at'] },
                        { association: 'timeEntries', attributes: ['id', 'duration_minutes', 'is_billable', 'started_at'] },
                    ],
                },
            ],
        });

        if (!client) {
            reply.status(404);
            return { success: false, error: 'Client not found' };
        }

        const projects = client.projects || [];

        // Calculate totals
        let totalHours = 0;
        let billableHours = 0;
        let totalBilled = 0;
        let totalEstimated = 0;
        let totalActual = 0;

        projects.forEach(project => {
            const entries = project.timeEntries || [];
            entries.forEach(entry => {
                const hours = (entry.duration_minutes || 0) / 60;
                totalHours += hours;
                if (entry.is_billable) {
                    billableHours += hours;
                    const rate = parseFloat(project.hourly_rate) || parseFloat(client.hourly_rate) || 0;
                    totalBilled += hours * rate;
                }
            });

            const tasks = project.tasks || [];
            tasks.forEach(task => {
                totalEstimated += parseFloat(task.estimated_hours) || 0;
                totalActual += parseFloat(task.actual_hours) || 0;
            });
        });

        // Calculate rentability (actual vs estimated ratio)
        const rentability = totalEstimated > 0 ? Math.round((totalEstimated / totalActual) * 100) : 100;

        // Average rating
        const ratings = [client.payment_rating, client.communication_rating, client.scope_rating].filter(r => r != null);
        const averageRating = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10 : null;

        return {
            success: true,
            data: {
                client: client.toJSON(),
                stats: {
                    totalProjects: projects.length,
                    activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
                    completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
                    totalHours: Math.round(totalHours * 10) / 10,
                    billableHours: Math.round(billableHours * 10) / 10,
                    totalBilled: Math.round(totalBilled * 100) / 100,
                    rentability,
                    averageRating,
                },
            },
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createClient = async (request, reply) => {
    try {
        const { userId } = request.params;
        const client = await WorkClient.create({
            ...request.body,
            user_id: userId,
        });
        reply.status(201);
        return { success: true, data: client, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateClient = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await WorkClient.update(request.body, {
            where: { id },
        });

        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Client not found' };
        }

        const client = await WorkClient.findByPk(id);
        return { success: true, data: client };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteClient = async (request, reply) => {
    try {
        const { id } = request.params;

        // Check if client has projects
        const projectCount = await WorkProject.count({ where: { client_id: id } });
        if (projectCount > 0) {
            reply.status(400);
            return { success: false, error: 'Cannot delete client with associated projects' };
        }

        const deleted = await WorkClient.destroy({ where: { id } });

        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Client not found' };
        }

        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== PROJECT MEMBERS ====================

const getProjectMembers = async (request, reply) => {
    try {
        const { projectId } = request.params;
        const members = await WorkProjectMember.findAll({
            where: { project_id: projectId },
            order: [['name', 'ASC']],
        });
        return { success: true, data: members };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createProjectMember = async (request, reply) => {
    try {
        const { projectId } = request.params;
        const member = await WorkProjectMember.create({
            ...request.body,
            project_id: projectId,
        });
        reply.status(201);
        return { success: true, data: member, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateProjectMember = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await WorkProjectMember.update(request.body, {
            where: { id },
        });

        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Project member not found' };
        }

        const member = await WorkProjectMember.findByPk(id);
        return { success: true, data: member };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteProjectMember = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await WorkProjectMember.destroy({ where: { id } });

        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Project member not found' };
        }

        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== PROJECT MILESTONES ====================

const getProjectMilestones = async (request, reply) => {
    try {
        const { projectId } = request.params;
        const milestones = await WorkProjectMilestone.findAll({
            where: { project_id: projectId },
            order: [['order', 'ASC'], ['target_date', 'ASC']],
        });
        return { success: true, data: milestones };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createProjectMilestone = async (request, reply) => {
    try {
        const { projectId } = request.params;

        // Get max order
        const maxOrder = await WorkProjectMilestone.max('order', {
            where: { project_id: projectId },
        });

        const milestone = await WorkProjectMilestone.create({
            ...request.body,
            project_id: projectId,
            order: (maxOrder || 0) + 1,
        });
        reply.status(201);
        return { success: true, data: milestone, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateProjectMilestone = async (request, reply) => {
    try {
        const { id } = request.params;
        const milestone = await WorkProjectMilestone.findByPk(id);

        if (!milestone) {
            reply.status(404);
            return { success: false, error: 'Milestone not found' };
        }

        // Auto-set completed_at when marking as complete
        if (request.body.completed_at === true) {
            request.body.completed_at = new Date();
        } else if (request.body.completed_at === false) {
            request.body.completed_at = null;
        }

        await milestone.update(request.body);
        return { success: true, data: milestone };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteProjectMilestone = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await WorkProjectMilestone.destroy({ where: { id } });

        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Milestone not found' };
        }

        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const reorderProjectMilestones = async (request, reply) => {
    try {
        const { projectId } = request.params;
        const { milestoneOrders } = request.body; // Array of { id, order }

        for (const item of milestoneOrders) {
            await WorkProjectMilestone.update(
                { order: item.order },
                { where: { id: item.id, project_id: projectId } }
            );
        }

        const milestones = await WorkProjectMilestone.findAll({
            where: { project_id: projectId },
            order: [['order', 'ASC']],
        });

        return { success: true, data: milestones };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== PROJECT ANALYSIS ====================

const getProjectAnalysis = async (request, reply) => {
    try {
        const { id } = request.params;
        const project = await WorkProject.findByPk(id, {
            include: [
                { association: 'clientRef' },
                { association: 'members' },
                { association: 'milestones' },
                {
                    association: 'tasks',
                    include: [
                        { association: 'status' },
                    ],
                },
                { association: 'timeEntries' },
            ],
        });

        if (!project) {
            reply.status(404);
            return { success: false, error: 'Project not found' };
        }

        const tasks = project.tasks || [];
        const entries = project.timeEntries || [];
        const milestones = project.milestones || [];

        // Task stats
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status?.is_done_status).length;
        const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Hours stats
        const budgetHours = parseFloat(project.budget_hours) || 0;
        const usedHours = entries.reduce((sum, e) => sum + ((e.duration_minutes || 0) / 60), 0);
        const hoursProgress = budgetHours > 0 ? Math.round((usedHours / budgetHours) * 100) : 0;
        const remainingHours = Math.max(0, budgetHours - usedHours);

        // Budget value stats
        const budgetValue = parseFloat(project.budget_value) || 0;
        const hourlyRate = parseFloat(project.hourly_rate) || 0;
        const billableEntries = entries.filter(e => e.is_billable);
        const billableHours = billableEntries.reduce((sum, e) => sum + ((e.duration_minutes || 0) / 60), 0);
        const earnedValue = billableHours * hourlyRate;

        // Milestone progress
        const completedMilestones = milestones.filter(m => m.completed_at).length;
        const milestoneProgress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

        // Delivery prediction based on last 3 days of work
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const recentEntries = entries.filter(e => new Date(e.started_at) >= threeDaysAgo);
        const recentHours = recentEntries.reduce((sum, e) => sum + ((e.duration_minutes || 0) / 60), 0);
        const avgHoursPerDay = recentHours / 3;

        let deliveryPrediction = null;
        if (avgHoursPerDay > 0 && remainingHours > 0) {
            const daysToComplete = Math.ceil(remainingHours / avgHoursPerDay);
            const predictedDate = new Date();
            predictedDate.setDate(predictedDate.getDate() + daysToComplete);

            deliveryPrediction = {
                predictedDate: predictedDate.toISOString().split('T')[0],
                daysRemaining: daysToComplete,
                avgHoursPerDay: Math.round(avgHoursPerDay * 10) / 10,
                onTrack: project.end_date ? new Date(predictedDate) <= new Date(project.end_date) : true,
            };
        }

        // Generate suggestions
        const suggestions = [];

        if (hoursProgress > 80 && taskProgress < 50) {
            suggestions.push({
                type: 'warning',
                message: 'Horas usadas acima de 80%, mas tarefas abaixo de 50%. Revise o escopo ou negocie mais horas.',
            });
        }

        if (hoursProgress > 100) {
            suggestions.push({
                type: 'danger',
                message: `Você excedeu o orçamento em ${Math.round(usedHours - budgetHours)}h. Considere faturar adicional.`,
            });
        }

        if (deliveryPrediction && !deliveryPrediction.onTrack) {
            suggestions.push({
                type: 'warning',
                message: `Previsão de entrega após a data limite. Acelere o ritmo para ${Math.round(remainingHours / Math.max(1, Math.ceil((new Date(project.end_date) - new Date()) / (1000 * 60 * 60 * 24))))}h/dia.`,
            });
        }

        const pendingMilestones = milestones.filter(m => !m.completed_at && m.target_date);
        const overdueMilestones = pendingMilestones.filter(m => new Date(m.target_date) < new Date());
        if (overdueMilestones.length > 0) {
            suggestions.push({
                type: 'warning',
                message: `${overdueMilestones.length} marco(s) em atraso. Priorize sua conclusão.`,
            });
        }

        return {
            success: true,
            data: {
                project: project.toJSON(),
                progress: {
                    tasks: {
                        total: totalTasks,
                        completed: completedTasks,
                        percentage: taskProgress,
                    },
                    hours: {
                        budget: budgetHours,
                        used: Math.round(usedHours * 10) / 10,
                        remaining: Math.round(remainingHours * 10) / 10,
                        percentage: hoursProgress,
                    },
                    budget: {
                        total: budgetValue,
                        earned: Math.round(earnedValue * 100) / 100,
                        remaining: Math.round((budgetValue - earnedValue) * 100) / 100,
                        percentage: budgetValue > 0 ? Math.round((earnedValue / budgetValue) * 100) : 0,
                    },
                    milestones: {
                        total: milestones.length,
                        completed: completedMilestones,
                        percentage: milestoneProgress,
                    },
                },
                deliveryPrediction,
                suggestions,
            },
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== DASHBOARD STATS ====================

const getWorkDashboard = async (request, reply) => {
    try {
        const { userId } = request.params;
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Get tasks by priority
        const tasksByPriority = await WorkTask.findAll({
            where: {
                user_id: userId,
                completed_at: null,
            },
            attributes: [
                'priority_quadrant',
                [fn('COUNT', col('id')), 'count'],
            ],
            group: ['priority_quadrant'],
        });

        // Get tasks due today
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);

        const tasksDueToday = await WorkTask.count({
            where: {
                user_id: userId,
                deadline: { [Op.between]: [todayStart, todayEnd] },
                completed_at: null,
            },
        });

        // Get overdue tasks
        const overdueTasks = await WorkTask.count({
            where: {
                user_id: userId,
                deadline: { [Op.lt]: todayStart },
                completed_at: null,
            },
        });

        // Get tasks completed this week
        const completedThisWeek = await WorkTask.count({
            where: {
                user_id: userId,
                completed_at: { [Op.gte]: startOfWeek },
            },
        });

        // Get hours worked this week
        const hoursThisWeek = await WorkTimeEntry.sum('duration_minutes', {
            where: {
                user_id: userId,
                started_at: { [Op.gte]: startOfWeek },
            },
        });

        // Get running timer
        const runningTimer = await WorkTimeEntry.findOne({
            where: { user_id: userId, is_running: true },
            include: [
                { association: 'task', attributes: ['id', 'title'] },
                { association: 'project', attributes: ['id', 'name', 'color'] },
            ],
        });

        // Get active projects count
        const activeProjects = await WorkProject.count({
            where: { user_id: userId, status: 'ACTIVE' },
        });

        return {
            success: true,
            data: {
                tasksByPriority: tasksByPriority.reduce((acc, item) => {
                    acc[item.priority_quadrant] = parseInt(item.dataValues.count);
                    return acc;
                }, {}),
                tasksDueToday,
                overdueTasks,
                completedThisWeek,
                hoursThisWeek: Math.round((hoursThisWeek || 0) / 60 * 10) / 10,
                runningTimer,
                activeProjects,
            },
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    // Profile
    getWorkProfile,
    updateWorkProfile,
    // Task Types
    getTaskTypes,
    createTaskType,
    updateTaskType,
    deleteTaskType,
    // Task Statuses
    getTaskStatuses,
    createTaskStatus,
    updateTaskStatus,
    reorderTaskStatuses,
    deleteTaskStatus,
    // Clients
    getClients,
    getClient,
    getClientDetails,
    createClient,
    updateClient,
    deleteClient,
    // Projects
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectAnalysis,
    // Project Members
    getProjectMembers,
    createProjectMember,
    updateProjectMember,
    deleteProjectMember,
    // Project Milestones
    getProjectMilestones,
    createProjectMilestone,
    updateProjectMilestone,
    deleteProjectMilestone,
    reorderProjectMilestones,
    // Tasks
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    // Time Entries
    getTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    startTimer,
    stopTimer,
    getRunningTimer,
    // Stats
    getEstimationAccuracy,
    suggestEstimate,
    getWorkDashboard,
};
