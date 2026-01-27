const okrController = require('../controllers/okrController');
const { common } = require('../schemas');

async function okrRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== OBJECTIVES ====================
    fastify.get('/users/:userId/work/okrs/objectives', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all objectives for a user',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'] },
                    area: { type: 'string', enum: ['CAREER', 'PROJECT', 'COMPANY', 'PERSONAL'] },
                    periodStart: { type: 'string', format: 'date' },
                    periodEnd: { type: 'string', format: 'date' },
                },
            },
        },
    }, okrController.getObjectives);

    fastify.get('/work/okrs/objectives/:id', {
        schema: {
            description: 'Get a specific objective',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, okrController.getObjective);

    fastify.post('/users/:userId/work/okrs/objectives', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create an objective',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, okrController.createObjective);

    fastify.put('/work/okrs/objectives/:id', {
        schema: {
            description: 'Update an objective',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, okrController.updateObjective);

    fastify.delete('/work/okrs/objectives/:id', {
        schema: {
            description: 'Delete an objective',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, okrController.deleteObjective);

    // ==================== KEY RESULTS ====================
    fastify.get('/work/okrs/objectives/:objectiveId/key-results', {
        schema: {
            description: 'Get key results for an objective',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
        },
    }, okrController.getKeyResults);

    fastify.post('/work/okrs/objectives/:objectiveId/key-results', {
        schema: {
            description: 'Create a key result',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
        },
    }, okrController.createKeyResult);

    fastify.put('/work/okrs/key-results/:id', {
        schema: {
            description: 'Update a key result',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, okrController.updateKeyResult);

    fastify.delete('/work/okrs/key-results/:id', {
        schema: {
            description: 'Delete a key result',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, okrController.deleteKeyResult);

    // ==================== KEY RESULT UPDATES ====================
    fastify.post('/work/okrs/key-results/:id/update', {
        schema: {
            description: 'Update a key result value',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, okrController.updateKeyResultValue);

    fastify.get('/work/okrs/key-results/:id/history', {
        schema: {
            description: 'Get key result update history',
            tags: ['Work - OKRs'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, okrController.getKeyResultHistory);
}

module.exports = okrRoutes;
