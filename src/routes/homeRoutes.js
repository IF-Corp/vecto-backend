const homeController = require('../controllers/homeController');

async function homeRoutes(fastify, options) {
    // ==================== SHOPPING LISTS ====================
    fastify.get('/users/:userId/shopping', homeController.getShoppingList);
    fastify.post('/users/:userId/shopping', homeController.createShoppingItem);
    fastify.put('/shopping/:id', homeController.updateShoppingItem);
    fastify.delete('/shopping/:id', homeController.deleteShoppingItem);

    // ==================== HOUSEHOLD INVENTORY ====================
    fastify.get('/users/:userId/inventory', homeController.getInventory);
    fastify.post('/users/:userId/inventory', homeController.createInventoryItem);
    fastify.put('/inventory/:id', homeController.updateInventoryItem);
    fastify.delete('/inventory/:id', homeController.deleteInventoryItem);

    // ==================== HOUSEHOLD CHORES ====================
    fastify.get('/users/:userId/chores', homeController.getChores);
    fastify.post('/users/:userId/chores', homeController.createChore);
    fastify.put('/chores/:id', homeController.updateChore);
    fastify.delete('/chores/:id', homeController.deleteChore);

    // ==================== CONTACTS ====================
    fastify.get('/users/:userId/contacts', homeController.getContacts);
    fastify.post('/users/:userId/contacts', homeController.createContact);
    fastify.put('/contacts/:id', homeController.updateContact);
    fastify.delete('/contacts/:id', homeController.deleteContact);

    // ==================== CALENDAR EVENTS ====================
    fastify.get('/users/:userId/events', homeController.getCalendarEvents);
    fastify.post('/users/:userId/events', homeController.createCalendarEvent);
    fastify.put('/events/:id', homeController.updateCalendarEvent);
    fastify.delete('/events/:id', homeController.deleteCalendarEvent);
}

module.exports = homeRoutes;
