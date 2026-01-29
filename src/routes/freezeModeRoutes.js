const freezeModeController = require('../controllers/freezeModeController');
const { freezeMode, common } = require('../schemas');

async function freezeModeRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== LEGACY ENDPOINTS ====================

    fastify.get('/users/:userId/freeze-mode', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get freeze mode configuration (legacy)',
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
            description: 'Update freeze mode configuration (legacy)',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: freezeMode.updateFreezeModeBody,
            response: {
                200: freezeMode.freezeModeResponse
            }
        }
    }, freezeModeController.updateFreezeModeConfig);

    // ==================== FREEZE PERIODS ====================

    // Get all freeze periods for user
    fastify.get('/users/:userId/freeze-periods', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all freeze periods for user',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: freezeMode.freezePeriodsQuerystring,
            response: {
                200: freezeMode.freezePeriodsListResponse
            }
        }
    }, freezeModeController.getFreezePeriods);

    // Get active freeze period
    fastify.get('/users/:userId/freeze-periods/active', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get active freeze period',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            response: {
                200: freezeMode.freezePeriodResponse
            }
        }
    }, freezeModeController.getActiveFreeze);

    // Get freeze statistics
    fastify.get('/users/:userId/freeze-periods/statistics', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get freeze statistics',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            response: {
                200: freezeMode.freezeStatisticsResponse
            }
        }
    }, freezeModeController.getFreezeStatistics);

    // Create new freeze period
    fastify.post('/users/:userId/freeze-periods', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create new freeze period',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: freezeMode.createFreezePeriodBody,
            response: {
                201: freezeMode.freezePeriodResponse
            }
        }
    }, freezeModeController.createFreezePeriod);

    // Get specific freeze period
    fastify.get('/freeze-periods/:id', {
        schema: {
            description: 'Get freeze period by ID',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: freezeMode.freezePeriodIdParams,
            response: {
                200: freezeMode.freezePeriodResponse
            }
        }
    }, freezeModeController.getFreezePeriod);

    // Update freeze period
    fastify.put('/freeze-periods/:id', {
        schema: {
            description: 'Update freeze period',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: freezeMode.freezePeriodIdParams,
            body: freezeMode.updateFreezePeriodBody,
            response: {
                200: freezeMode.freezePeriodResponse
            }
        }
    }, freezeModeController.updateFreezePeriod);

    // Activate a scheduled freeze period
    fastify.post('/freeze-periods/:id/activate', {
        schema: {
            description: 'Activate a scheduled freeze period',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: freezeMode.freezePeriodIdParams,
            response: {
                200: freezeMode.freezePeriodResponse
            }
        }
    }, freezeModeController.activateFreezePeriod);

    // Cancel freeze period
    fastify.post('/freeze-periods/:id/cancel', {
        schema: {
            description: 'Cancel freeze period',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: freezeMode.freezePeriodIdParams,
            response: {
                200: freezeMode.freezePeriodResponse
            }
        }
    }, freezeModeController.cancelFreezePeriod);

    // Delete freeze period
    fastify.delete('/freeze-periods/:id', {
        schema: {
            description: 'Delete freeze period',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: freezeMode.freezePeriodIdParams
        }
    }, freezeModeController.deleteFreezePeriod);

    // ==================== QUICK ACTIONS ====================

    // Quick activate freeze mode
    fastify.post('/users/:userId/freeze-mode/activate', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Quick activate freeze mode',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: freezeMode.activateFreezeModeBody,
            response: {
                200: freezeMode.freezePeriodResponse
            }
        }
    }, freezeModeController.activateFreezeMode);

    // Quick deactivate freeze mode
    fastify.post('/users/:userId/freeze-mode/deactivate', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Deactivate freeze mode',
            tags: ['Freeze Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            response: {
                200: freezeMode.freezePeriodResponse
            }
        }
    }, freezeModeController.deactivateFreezeMode);
}

module.exports = freezeModeRoutes;
