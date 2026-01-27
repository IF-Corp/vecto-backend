const workController = require('../controllers/workController');
const { common } = require('../schemas');

async function workRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== WORK PROFILE ====================
    fastify.get('/users/:userId/work/profile', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get work profile for a user',
            tags: ['Work - Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.getWorkProfile);

    fastify.put('/users/:userId/work/profile', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update work profile',
            tags: ['Work - Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.updateWorkProfile);

    // ==================== TASK TYPES ====================
    fastify.get('/users/:userId/work/task-types', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all task types for a user',
            tags: ['Work - Task Types'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.getTaskTypes);

    fastify.post('/users/:userId/work/task-types', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a custom task type',
            tags: ['Work - Task Types'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.createTaskType);

    fastify.put('/users/:userId/work/task-types/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update a task type',
            tags: ['Work - Task Types'],
            security: [{ bearerAuth: [] }],
        },
    }, workController.updateTaskType);

    fastify.delete('/users/:userId/work/task-types/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Delete a task type',
            tags: ['Work - Task Types'],
            security: [{ bearerAuth: [] }],
        },
    }, workController.deleteTaskType);

    // ==================== TASK STATUSES ====================
    fastify.get('/users/:userId/work/task-statuses', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all task statuses for a user',
            tags: ['Work - Task Statuses'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.getTaskStatuses);

    fastify.post('/users/:userId/work/task-statuses', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a custom task status',
            tags: ['Work - Task Statuses'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.createTaskStatus);

    fastify.put('/users/:userId/work/task-statuses/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update a task status',
            tags: ['Work - Task Statuses'],
            security: [{ bearerAuth: [] }],
        },
    }, workController.updateTaskStatus);

    fastify.put('/users/:userId/work/task-statuses/reorder', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Reorder task statuses',
            tags: ['Work - Task Statuses'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.reorderTaskStatuses);

    fastify.delete('/users/:userId/work/task-statuses/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Delete a task status',
            tags: ['Work - Task Statuses'],
            security: [{ bearerAuth: [] }],
        },
    }, workController.deleteTaskStatus);

    // ==================== CLIENTS ====================
    fastify.get('/users/:userId/work/clients', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all clients for a user',
            tags: ['Work - Clients'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.getClients);

    fastify.get('/work/clients/:id', {
        schema: {
            description: 'Get a specific client',
            tags: ['Work - Clients'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.getClient);

    fastify.get('/work/clients/:id/details', {
        schema: {
            description: 'Get client details with stats and history',
            tags: ['Work - Clients'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.getClientDetails);

    fastify.post('/users/:userId/work/clients', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a client',
            tags: ['Work - Clients'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.createClient);

    fastify.put('/work/clients/:id', {
        schema: {
            description: 'Update a client',
            tags: ['Work - Clients'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.updateClient);

    fastify.delete('/work/clients/:id', {
        schema: {
            description: 'Delete a client',
            tags: ['Work - Clients'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.deleteClient);

    // ==================== PROJECTS ====================
    fastify.get('/users/:userId/work/projects', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all work projects for a user',
            tags: ['Work - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.getProjects);

    fastify.get('/work/projects/:id', {
        schema: {
            description: 'Get a specific work project',
            tags: ['Work - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.getProject);

    fastify.post('/users/:userId/work/projects', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a work project',
            tags: ['Work - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.createProject);

    fastify.put('/work/projects/:id', {
        schema: {
            description: 'Update a work project',
            tags: ['Work - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.updateProject);

    fastify.delete('/work/projects/:id', {
        schema: {
            description: 'Delete a work project',
            tags: ['Work - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.deleteProject);

    fastify.get('/work/projects/:id/analysis', {
        schema: {
            description: 'Get project analysis with progress, prediction and suggestions',
            tags: ['Work - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.getProjectAnalysis);

    // ==================== PROJECT MEMBERS ====================
    fastify.get('/work/projects/:projectId/members', {
        schema: {
            description: 'Get all members of a project',
            tags: ['Work - Project Members'],
            security: [{ bearerAuth: [] }],
        },
    }, workController.getProjectMembers);

    fastify.post('/work/projects/:projectId/members', {
        schema: {
            description: 'Add a member to a project',
            tags: ['Work - Project Members'],
            security: [{ bearerAuth: [] }],
        },
    }, workController.createProjectMember);

    fastify.put('/work/project-members/:id', {
        schema: {
            description: 'Update a project member',
            tags: ['Work - Project Members'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.updateProjectMember);

    fastify.delete('/work/project-members/:id', {
        schema: {
            description: 'Remove a member from a project',
            tags: ['Work - Project Members'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.deleteProjectMember);

    // ==================== PROJECT MILESTONES ====================
    fastify.get('/work/projects/:projectId/milestones', {
        schema: {
            description: 'Get all milestones of a project',
            tags: ['Work - Project Milestones'],
            security: [{ bearerAuth: [] }],
        },
    }, workController.getProjectMilestones);

    fastify.post('/work/projects/:projectId/milestones', {
        schema: {
            description: 'Add a milestone to a project',
            tags: ['Work - Project Milestones'],
            security: [{ bearerAuth: [] }],
        },
    }, workController.createProjectMilestone);

    fastify.put('/work/project-milestones/:id', {
        schema: {
            description: 'Update a project milestone',
            tags: ['Work - Project Milestones'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.updateProjectMilestone);

    fastify.delete('/work/project-milestones/:id', {
        schema: {
            description: 'Delete a project milestone',
            tags: ['Work - Project Milestones'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.deleteProjectMilestone);

    fastify.put('/work/projects/:projectId/milestones/reorder', {
        schema: {
            description: 'Reorder project milestones',
            tags: ['Work - Project Milestones'],
            security: [{ bearerAuth: [] }],
        },
    }, workController.reorderProjectMilestones);

    // ==================== TASKS ====================
    fastify.get('/users/:userId/work/tasks', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all work tasks for a user',
            tags: ['Work - Tasks'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.getTasks);

    fastify.get('/work/tasks/:id', {
        schema: {
            description: 'Get a specific work task',
            tags: ['Work - Tasks'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.getTask);

    fastify.post('/users/:userId/work/tasks', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a work task',
            tags: ['Work - Tasks'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.createTask);

    fastify.put('/work/tasks/:id', {
        schema: {
            description: 'Update a work task',
            tags: ['Work - Tasks'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.updateTask);

    fastify.delete('/work/tasks/:id', {
        schema: {
            description: 'Delete a work task',
            tags: ['Work - Tasks'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.deleteTask);

    // ==================== TIME ENTRIES ====================
    fastify.get('/users/:userId/work/time-entries', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get time entries for a user',
            tags: ['Work - Time Tracking'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.getTimeEntries);

    fastify.post('/users/:userId/work/time-entries', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a time entry',
            tags: ['Work - Time Tracking'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.createTimeEntry);

    fastify.put('/work/time-entries/:id', {
        schema: {
            description: 'Update a time entry',
            tags: ['Work - Time Tracking'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.updateTimeEntry);

    fastify.delete('/work/time-entries/:id', {
        schema: {
            description: 'Delete a time entry',
            tags: ['Work - Time Tracking'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, workController.deleteTimeEntry);

    fastify.post('/users/:userId/work/timer/start', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Start a timer',
            tags: ['Work - Time Tracking'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.startTimer);

    fastify.post('/users/:userId/work/timer/stop', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Stop the running timer',
            tags: ['Work - Time Tracking'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.stopTimer);

    fastify.get('/users/:userId/work/timer/running', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get the running timer',
            tags: ['Work - Time Tracking'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.getRunningTimer);

    // ==================== STATS ====================
    fastify.get('/users/:userId/work/estimation-accuracy', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get estimation accuracy stats',
            tags: ['Work - Stats'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.getEstimationAccuracy);

    fastify.get('/users/:userId/work/suggest-estimate', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get suggested estimate for a task',
            tags: ['Work - Stats'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.suggestEstimate);

    fastify.get('/users/:userId/work/dashboard', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get work dashboard stats',
            tags: ['Work - Stats'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, workController.getWorkDashboard);
}

module.exports = workRoutes;
