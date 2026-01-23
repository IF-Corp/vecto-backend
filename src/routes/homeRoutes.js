const homeController = require('../controllers/homeController');
const { home, common } = require('../schemas');

async function homeRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== SHOPPING LISTS ====================
    fastify.get('/users/:userId/shopping', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get shopping lists for a user',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, homeController.getShoppingList);

    fastify.post('/users/:userId/shopping', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a shopping list',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: home.createShoppingListBody
        }
    }, homeController.createShoppingItem);

    fastify.put('/shopping/:id', {
        schema: {
            description: 'Update a shopping list',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: home.updateShoppingListBody
        }
    }, homeController.updateShoppingItem);

    fastify.delete('/shopping/:id', {
        schema: {
            description: 'Delete a shopping list',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, homeController.deleteShoppingItem);

    // ==================== HOUSEHOLD INVENTORY ====================
    fastify.get('/users/:userId/inventory', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get household inventory for a user',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, homeController.getInventory);

    fastify.post('/users/:userId/inventory', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Add inventory item',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: home.createInventoryBody
        }
    }, homeController.createInventoryItem);

    fastify.put('/inventory/:id', {
        schema: {
            description: 'Update inventory item',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: home.updateInventoryBody
        }
    }, homeController.updateInventoryItem);

    fastify.delete('/inventory/:id', {
        schema: {
            description: 'Delete inventory item',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, homeController.deleteInventoryItem);

    // ==================== HOUSEHOLD CHORES ====================
    fastify.get('/users/:userId/chores', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get household chores for a user',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, homeController.getChores);

    fastify.post('/users/:userId/chores', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a chore',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: home.createChoreBody
        }
    }, homeController.createChore);

    fastify.put('/chores/:id', {
        schema: {
            description: 'Update a chore',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: home.updateChoreBody
        }
    }, homeController.updateChore);

    fastify.delete('/chores/:id', {
        schema: {
            description: 'Delete a chore',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, homeController.deleteChore);

    // ==================== CONTACTS ====================
    fastify.get('/users/:userId/contacts', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get contacts for a user',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, homeController.getContacts);

    fastify.post('/users/:userId/contacts', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a contact',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: home.createContactBody
        }
    }, homeController.createContact);

    fastify.put('/contacts/:id', {
        schema: {
            description: 'Update a contact',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: home.updateContactBody
        }
    }, homeController.updateContact);

    fastify.delete('/contacts/:id', {
        schema: {
            description: 'Delete a contact',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, homeController.deleteContact);

    // ==================== CALENDAR EVENTS ====================
    fastify.get('/users/:userId/events', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get calendar events for a user',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, homeController.getCalendarEvents);

    fastify.post('/users/:userId/events', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a calendar event',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: home.createCalendarEventBody
        }
    }, homeController.createCalendarEvent);

    fastify.put('/events/:id', {
        schema: {
            description: 'Update a calendar event',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: home.updateCalendarEventBody
        }
    }, homeController.updateCalendarEvent);

    fastify.delete('/events/:id', {
        schema: {
            description: 'Delete a calendar event',
            tags: ['Home'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, homeController.deleteCalendarEvent);
}

module.exports = homeRoutes;
