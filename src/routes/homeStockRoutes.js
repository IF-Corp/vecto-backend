const homeStockController = require('../controllers/homeStockController');

async function homeStockRoutes(fastify, options) {
    // Get all stock items for a space
    fastify.get(
        '/users/:userId/spaces/:spaceId/stock',
        homeStockController.getStockItems
    );

    // Get low stock items
    fastify.get(
        '/users/:userId/spaces/:spaceId/stock/low',
        homeStockController.getLowStockItems
    );

    // Get expiring items
    fastify.get(
        '/users/:userId/spaces/:spaceId/stock/expiring',
        homeStockController.getExpiringItems
    );

    // Get a single stock item
    fastify.get(
        '/users/:userId/spaces/:spaceId/stock/:itemId',
        homeStockController.getStockItem
    );

    // Create a new stock item
    fastify.post(
        '/users/:userId/spaces/:spaceId/stock',
        homeStockController.createStockItem
    );

    // Update a stock item
    fastify.put(
        '/users/:userId/spaces/:spaceId/stock/:itemId',
        homeStockController.updateStockItem
    );

    // Update stock quantity
    fastify.patch(
        '/users/:userId/spaces/:spaceId/stock/:itemId/quantity',
        homeStockController.updateStockQuantity
    );

    // Delete a stock item
    fastify.delete(
        '/users/:userId/spaces/:spaceId/stock/:itemId',
        homeStockController.deleteStockItem
    );

    // Add stock item to shopping list
    fastify.post(
        '/users/:userId/spaces/:spaceId/stock/:itemId/add-to-list',
        homeStockController.addToShoppingList
    );
}

module.exports = homeStockRoutes;
