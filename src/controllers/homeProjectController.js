const HomeProject = require('../models/HomeProject');
const HomeProjectTask = require('../models/HomeProjectTask');
const { Op } = require('sequelize');

// Get all projects for a space
const getProjects = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { status } = request.query;

        const where = { space_id: spaceId };

        if (status) {
            where.status = status;
        }

        const projects = await HomeProject.findAll({
            where,
            order: [['created_at', 'DESC']],
        });

        // Get tasks and calculate progress for each project
        const projectsWithProgress = await Promise.all(
            projects.map(async (project) => {
                const tasks = await HomeProjectTask.findAll({
                    where: { project_id: project.id },
                });

                const totalTasks = tasks.length;
                const completedTasks = tasks.filter((t) => t.is_completed).length;
                const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                const totalSpent = tasks.reduce(
                    (sum, t) => sum + parseFloat(t.actual_cost || 0),
                    0
                );

                return {
                    ...project.toJSON(),
                    progress: Math.round(progress),
                    totalTasks,
                    completedTasks,
                    totalSpent,
                };
            })
        );

        return reply.send({ success: true, data: projectsWithProgress });
    } catch (error) {
        console.error('Error getting projects:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get a single project
const getProject = async (request, reply) => {
    try {
        const { userId, spaceId, projectId } = request.params;

        const project = await HomeProject.findOne({
            where: { id: projectId, space_id: spaceId },
        });

        if (!project) {
            return reply.status(404).send({ success: false, error: 'Project not found' });
        }

        const tasks = await HomeProjectTask.findAll({
            where: { project_id: project.id },
            order: [['sort_order', 'ASC']],
        });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.is_completed).length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        const totalSpent = tasks.reduce(
            (sum, t) => sum + parseFloat(t.actual_cost || 0),
            0
        );
        const totalEstimated = tasks.reduce(
            (sum, t) => sum + parseFloat(t.estimated_cost || 0),
            0
        );

        return reply.send({
            success: true,
            data: {
                ...project.toJSON(),
                tasks,
                progress: Math.round(progress),
                totalTasks,
                completedTasks,
                totalSpent,
                totalEstimated,
            },
        });
    } catch (error) {
        console.error('Error getting project:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Create a new project
const createProject = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const data = request.body;

        const project = await HomeProject.create({
            ...data,
            space_id: spaceId,
        });

        return reply.status(201).send({ success: true, data: project });
    } catch (error) {
        console.error('Error creating project:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Update a project
const updateProject = async (request, reply) => {
    try {
        const { userId, spaceId, projectId } = request.params;
        const data = request.body;

        const project = await HomeProject.findOne({
            where: { id: projectId, space_id: spaceId },
        });

        if (!project) {
            return reply.status(404).send({ success: false, error: 'Project not found' });
        }

        await project.update(data);

        return reply.send({ success: true, data: project });
    } catch (error) {
        console.error('Error updating project:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Delete a project
const deleteProject = async (request, reply) => {
    try {
        const { userId, spaceId, projectId } = request.params;

        const project = await HomeProject.findOne({
            where: { id: projectId, space_id: spaceId },
        });

        if (!project) {
            return reply.status(404).send({ success: false, error: 'Project not found' });
        }

        await HomeProjectTask.destroy({ where: { project_id: projectId } });
        await project.destroy();

        return reply.send({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get project tasks
const getProjectTasks = async (request, reply) => {
    try {
        const { userId, spaceId, projectId } = request.params;

        const tasks = await HomeProjectTask.findAll({
            where: { project_id: projectId },
            order: [['sort_order', 'ASC']],
        });

        return reply.send({ success: true, data: tasks });
    } catch (error) {
        console.error('Error getting project tasks:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Create a project task
const createProjectTask = async (request, reply) => {
    try {
        const { userId, spaceId, projectId } = request.params;
        const data = request.body;

        // Get max sort order
        const maxOrder = await HomeProjectTask.max('sort_order', {
            where: { project_id: projectId },
        });

        const task = await HomeProjectTask.create({
            ...data,
            project_id: projectId,
            sort_order: (maxOrder || 0) + 1,
        });

        return reply.status(201).send({ success: true, data: task });
    } catch (error) {
        console.error('Error creating project task:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Update a project task
const updateProjectTask = async (request, reply) => {
    try {
        const { userId, spaceId, projectId, taskId } = request.params;
        const data = request.body;

        const task = await HomeProjectTask.findOne({
            where: { id: taskId, project_id: projectId },
        });

        if (!task) {
            return reply.status(404).send({ success: false, error: 'Task not found' });
        }

        await task.update(data);

        return reply.send({ success: true, data: task });
    } catch (error) {
        console.error('Error updating project task:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Complete a project task
const completeProjectTask = async (request, reply) => {
    try {
        const { userId, spaceId, projectId, taskId } = request.params;
        const { actualCost } = request.body;

        const task = await HomeProjectTask.findOne({
            where: { id: taskId, project_id: projectId },
        });

        if (!task) {
            return reply.status(404).send({ success: false, error: 'Task not found' });
        }

        await task.update({
            is_completed: true,
            completed_at: new Date(),
            actual_cost: actualCost || task.estimated_cost,
        });

        return reply.send({ success: true, data: task });
    } catch (error) {
        console.error('Error completing project task:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Delete a project task
const deleteProjectTask = async (request, reply) => {
    try {
        const { userId, spaceId, projectId, taskId } = request.params;

        const task = await HomeProjectTask.findOne({
            where: { id: taskId, project_id: projectId },
        });

        if (!task) {
            return reply.status(404).send({ success: false, error: 'Task not found' });
        }

        await task.destroy();

        return reply.send({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting project task:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Reorder project tasks
const reorderProjectTasks = async (request, reply) => {
    try {
        const { userId, spaceId, projectId } = request.params;
        const { taskIds } = request.body;

        await Promise.all(
            taskIds.map((taskId, index) =>
                HomeProjectTask.update(
                    { sort_order: index },
                    { where: { id: taskId, project_id: projectId } }
                )
            )
        );

        return reply.send({ success: true, message: 'Tasks reordered successfully' });
    } catch (error) {
        console.error('Error reordering project tasks:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectTasks,
    createProjectTask,
    updateProjectTask,
    completeProjectTask,
    deleteProjectTask,
    reorderProjectTasks,
};
