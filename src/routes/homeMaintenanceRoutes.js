const homeMaintenanceController = require('../controllers/homeMaintenanceController');

const uuidPattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

const spaceIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId'],
};

const itemIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
        id: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId', 'id'],
};

async function homeMaintenanceRoutes(fastify, options) {
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== MAINTENANCES ====================

    fastify.get('/users/:userId/home/spaces/:spaceId/maintenances', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all maintenances for a space',
            tags: ['Home - Maintenance'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeMaintenanceController.getMaintenances);

    fastify.get('/users/:userId/home/spaces/:spaceId/maintenances/upcoming', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get upcoming maintenances',
            tags: ['Home - Maintenance'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeMaintenanceController.getUpcomingMaintenances);

    fastify.get('/users/:userId/home/spaces/:spaceId/maintenances/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get a specific maintenance',
            tags: ['Home - Maintenance'],
            security: [{ bearerAuth: [] }],
            params: itemIdParams,
        },
    }, homeMaintenanceController.getMaintenance);

    fastify.post('/users/:userId/home/spaces/:spaceId/maintenances', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a maintenance',
            tags: ['Home - Maintenance'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeMaintenanceController.createMaintenance);

    fastify.put('/users/:userId/home/spaces/:spaceId/maintenances/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update a maintenance',
            tags: ['Home - Maintenance'],
            security: [{ bearerAuth: [] }],
            params: itemIdParams,
        },
    }, homeMaintenanceController.updateMaintenance);

    fastify.post('/users/:userId/home/spaces/:spaceId/maintenances/:id/complete', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Mark maintenance as done',
            tags: ['Home - Maintenance'],
            security: [{ bearerAuth: [] }],
            params: itemIdParams,
        },
    }, homeMaintenanceController.completeMaintenance);

    fastify.delete('/users/:userId/home/spaces/:spaceId/maintenances/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Delete a maintenance',
            tags: ['Home - Maintenance'],
            security: [{ bearerAuth: [] }],
            params: itemIdParams,
        },
    }, homeMaintenanceController.deleteMaintenance);

    // ==================== WARRANTIES ====================

    fastify.get('/users/:userId/home/spaces/:spaceId/warranties', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all warranties for a space',
            tags: ['Home - Warranty'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeMaintenanceController.getWarranties);

    fastify.get('/users/:userId/home/spaces/:spaceId/warranties/expiring', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get expiring warranties',
            tags: ['Home - Warranty'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeMaintenanceController.getExpiringWarranties);

    fastify.get('/users/:userId/home/spaces/:spaceId/warranties/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get a specific warranty',
            tags: ['Home - Warranty'],
            security: [{ bearerAuth: [] }],
            params: itemIdParams,
        },
    }, homeMaintenanceController.getWarranty);

    fastify.post('/users/:userId/home/spaces/:spaceId/warranties', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a warranty',
            tags: ['Home - Warranty'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeMaintenanceController.createWarranty);

    fastify.put('/users/:userId/home/spaces/:spaceId/warranties/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update a warranty',
            tags: ['Home - Warranty'],
            security: [{ bearerAuth: [] }],
            params: itemIdParams,
        },
    }, homeMaintenanceController.updateWarranty);

    fastify.delete('/users/:userId/home/spaces/:spaceId/warranties/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Delete a warranty',
            tags: ['Home - Warranty'],
            security: [{ bearerAuth: [] }],
            params: itemIdParams,
        },
    }, homeMaintenanceController.deleteWarranty);
}

module.exports = homeMaintenanceRoutes;
