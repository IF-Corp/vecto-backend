const homeShoppingController = require('../controllers/homeShoppingController');

const uuidPattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

const spaceIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId'],
};

const listIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
        id: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId', 'id'],
};

const listItemParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
        listId: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId', 'listId'],
};

const itemIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
        listId: { type: 'string', pattern: uuidPattern },
        id: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId', 'listId', 'id'],
};

async function homeShoppingRoutes(fastify, options) {
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== LISTS ====================

    fastify.get('/users/:userId/home/spaces/:spaceId/shopping', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all shopping lists for a space',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeShoppingController.getShoppingLists);

    fastify.get('/users/:userId/home/spaces/:spaceId/shopping/frequent-items', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get frequently purchased items',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeShoppingController.getFrequentItems);

    fastify.get('/users/:userId/home/spaces/:spaceId/shopping/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get a shopping list with items',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: listIdParams,
        },
    }, homeShoppingController.getShoppingList);

    fastify.post('/users/:userId/home/spaces/:spaceId/shopping', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a shopping list',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: spaceIdParams,
        },
    }, homeShoppingController.createShoppingList);

    fastify.put('/users/:userId/home/spaces/:spaceId/shopping/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update a shopping list',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: listIdParams,
        },
    }, homeShoppingController.updateShoppingList);

    fastify.delete('/users/:userId/home/spaces/:spaceId/shopping/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Delete a shopping list',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: listIdParams,
        },
    }, homeShoppingController.deleteShoppingList);

    fastify.post('/users/:userId/home/spaces/:spaceId/shopping/:id/clear-purchased', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Clear purchased items from list',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: listIdParams,
        },
    }, homeShoppingController.clearPurchasedItems);

    // ==================== ITEMS ====================

    fastify.post('/users/:userId/home/spaces/:spaceId/shopping/:listId/items', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Add item to list',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: listItemParams,
        },
    }, homeShoppingController.addItem);

    fastify.post('/users/:userId/home/spaces/:spaceId/shopping/:listId/items/bulk', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Add multiple items to list',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: listItemParams,
        },
    }, homeShoppingController.bulkAddItems);

    fastify.put('/users/:userId/home/spaces/:spaceId/shopping/:listId/items/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update an item',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: itemIdParams,
        },
    }, homeShoppingController.updateItem);

    fastify.post('/users/:userId/home/spaces/:spaceId/shopping/:listId/items/:id/toggle', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Toggle item purchased status',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: itemIdParams,
        },
    }, homeShoppingController.toggleItemPurchased);

    fastify.delete('/users/:userId/home/spaces/:spaceId/shopping/:listId/items/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Delete an item',
            tags: ['Home - Shopping'],
            security: [{ bearerAuth: [] }],
            params: itemIdParams,
        },
    }, homeShoppingController.deleteItem);
}

module.exports = homeShoppingRoutes;
