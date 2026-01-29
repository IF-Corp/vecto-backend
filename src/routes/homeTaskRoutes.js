const homeTaskController = require('../controllers/homeTaskController');
const { common } = require('../schemas');

const uuidPattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

const spaceIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId'],
};

const taskIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
        id: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId', 'id'],
};

const occurrenceIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
        id: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId', 'id'],
};

async function homeTaskRoutes(fastify, options) {
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== TASKS ====================

    fastify.get('/users/:userId/home/spaces/:spaceId/tasks', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all tasks for a space',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeTaskController.getTasks);

    fastify.get('/users/:userId/home/spaces/:spaceId/tasks/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get a specific task',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: taskIdParams,
        },
    }, homeTaskController.getTask);

    fastify.post('/users/:userId/home/spaces/:spaceId/tasks', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new task',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeTaskController.createTask);

    fastify.put('/users/:userId/home/spaces/:spaceId/tasks/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update a task',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: taskIdParams,
        },
    }, homeTaskController.updateTask);

    fastify.delete('/users/:userId/home/spaces/:spaceId/tasks/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Delete a task',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: taskIdParams,
        },
    }, homeTaskController.deleteTask);

    // ==================== OCCURRENCES ====================

    fastify.get('/users/:userId/home/spaces/:spaceId/tasks/today', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get today\'s task occurrences',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeTaskController.getTodayOccurrences);

    fastify.get('/users/:userId/home/spaces/:spaceId/tasks/occurrences', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get task occurrences by date range',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
            querystring: {
                type: 'object',
                properties: {
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                },
                required: ['startDate', 'endDate'],
            },
        },
    }, homeTaskController.getOccurrencesByDateRange);

    fastify.post('/users/:userId/home/spaces/:spaceId/occurrences/:id/complete', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Mark an occurrence as completed',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: occurrenceIdParams,
        },
    }, homeTaskController.completeOccurrence);

    fastify.post('/users/:userId/home/spaces/:spaceId/occurrences/:id/skip', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Skip an occurrence',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: occurrenceIdParams,
        },
    }, homeTaskController.skipOccurrence);

    fastify.post('/users/:userId/home/spaces/:spaceId/occurrences/:id/undo', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Undo a completed/skipped occurrence',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: occurrenceIdParams,
        },
    }, homeTaskController.undoOccurrence);

    // ==================== STATS ====================

    fastify.get('/users/:userId/home/spaces/:spaceId/tasks/stats', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get task statistics',
            tags: ['Home - Tasks'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeTaskController.getTaskStats);
}

module.exports = homeTaskRoutes;
