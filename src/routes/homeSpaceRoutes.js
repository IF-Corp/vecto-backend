const homeSpaceController = require('../controllers/homeSpaceController');
const { common } = require('../schemas');
const homeSpaceSchema = require('../schemas/homeSpaceSchema');

async function homeSpaceRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== SPACES ====================

    fastify.get('/users/:userId/home/spaces', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all home spaces for a user',
            tags: ['Home - Spaces'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, homeSpaceController.getSpaces);

    fastify.get('/users/:userId/home/spaces/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get a specific home space',
            tags: ['Home - Spaces'],
            security: [{ bearerAuth: [] }],
            params: homeSpaceSchema.spaceIdParams,
        },
    }, homeSpaceController.getSpace);

    fastify.post('/users/:userId/home/spaces', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new home space',
            tags: ['Home - Spaces'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: homeSpaceSchema.createSpaceBody,
        },
    }, homeSpaceController.createSpace);

    fastify.put('/users/:userId/home/spaces/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update a home space',
            tags: ['Home - Spaces'],
            security: [{ bearerAuth: [] }],
            params: homeSpaceSchema.spaceIdParams,
            body: homeSpaceSchema.updateSpaceBody,
        },
    }, homeSpaceController.updateSpace);

    fastify.delete('/users/:userId/home/spaces/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Delete a home space',
            tags: ['Home - Spaces'],
            security: [{ bearerAuth: [] }],
            params: homeSpaceSchema.spaceIdParams,
        },
    }, homeSpaceController.deleteSpace);

    // ==================== SPACE MODULES ====================

    fastify.put('/users/:userId/home/spaces/:id/modules', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update all modules for a space',
            tags: ['Home - Spaces'],
            security: [{ bearerAuth: [] }],
            params: homeSpaceSchema.spaceIdParams,
            body: homeSpaceSchema.updateSpaceModulesBody,
        },
    }, homeSpaceController.updateSpaceModules);

    fastify.patch('/users/:userId/home/spaces/:id/modules/:moduleType', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Toggle a specific module on/off',
            tags: ['Home - Spaces'],
            security: [{ bearerAuth: [] }],
            params: homeSpaceSchema.spaceModuleParams,
            body: homeSpaceSchema.toggleModuleBody,
        },
    }, homeSpaceController.toggleSpaceModule);
}

module.exports = homeSpaceRoutes;
