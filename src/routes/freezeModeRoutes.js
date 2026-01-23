const freezeModeController = require('../controllers/freezeModeController');
const { freezeMode, common } = require('../schemas');

async function freezeModeRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    fastify.get('/users/:userId/freeze-mode', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get freeze mode configuration',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            response: {
                200: freezeMode.freezeModeResponse
            }
        }
    }, freezeModeController.getFreezeModeConfig);

    fastify.put('/users/:userId/freeze-mode', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update freeze mode configuration',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: freezeMode.updateFreezeModeBody,
            response: {
                200: freezeMode.freezeModeResponse
            }
        }
    }, freezeModeController.updateFreezeModeConfig);

    fastify.post('/users/:userId/freeze-mode/activate', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Activate freeze mode',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: freezeMode.activateFreezeModeBody,
            response: {
                200: freezeMode.freezeModeResponse
            }
        }
    }, freezeModeController.activateFreezeMode);

    fastify.post('/users/:userId/freeze-mode/deactivate', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Deactivate freeze mode',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            response: {
                200: freezeMode.freezeModeResponse
            }
        }
    }, freezeModeController.deactivateFreezeMode);
}

module.exports = freezeModeRoutes;
