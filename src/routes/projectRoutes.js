const projectController = require('../controllers/projectController');
const { project, common } = require('../schemas');

async function projectRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== PROJECTS ====================
    fastify.get('/users/:userId/projects', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all projects for a user',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, projectController.getProjects);

    fastify.post('/users/:userId/projects', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new project',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: project.createProjectBody
        }
    }, projectController.createProject);

    fastify.put('/projects/:id', {
        schema: {
            description: 'Update a project',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: project.updateProjectBody
        }
    }, projectController.updateProject);

    fastify.delete('/projects/:id', {
        schema: {
            description: 'Delete a project',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, projectController.deleteProject);

    // ==================== TASKS ====================
    fastify.get('/users/:userId/tasks', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all tasks for a user',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, projectController.getTasks);

    fastify.post('/users/:userId/tasks', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new task',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: project.createTaskBody
        }
    }, projectController.createTask);

    fastify.put('/tasks/:id', {
        schema: {
            description: 'Update a task',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: project.updateTaskBody
        }
    }, projectController.updateTask);

    fastify.delete('/tasks/:id', {
        schema: {
            description: 'Delete a task',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, projectController.deleteTask);

    fastify.get('/tasks/:id', {
        schema: {
            description: 'Get a single task by ID',
            tags: ['Tasks'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, projectController.getTaskById);

    fastify.patch('/tasks/:id/status', {
        schema: {
            description: 'Update task status (optimized for drag & drop)',
            tags: ['Tasks'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['BACKLOG', 'TODO', 'DOING', 'DONE'] }
                },
                required: ['status']
            }
        }
    }, projectController.updateTaskStatus);

    // ==================== MEETINGS ====================
    fastify.get('/projects/:projectId/meetings', {
        schema: {
            description: 'Get meetings for a project',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    projectId: { type: 'string', pattern: common.uuidPattern }
                },
                required: ['projectId']
            }
        }
    }, projectController.getMeetings);

    fastify.post('/projects/:projectId/meetings', {
        schema: {
            description: 'Create a meeting for a project',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    projectId: { type: 'string', pattern: common.uuidPattern }
                },
                required: ['projectId']
            },
            body: project.createMeetingBody
        }
    }, projectController.createMeeting);

    fastify.delete('/meetings/:id', {
        schema: {
            description: 'Delete a meeting',
            tags: ['Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, projectController.deleteMeeting);
}

module.exports = projectRoutes;
