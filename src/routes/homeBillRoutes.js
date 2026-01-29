const homeBillController = require('../controllers/homeBillController');

async function homeBillRoutes(fastify, options) {
    // Bills CRUD
    fastify.get(
        '/users/:userId/spaces/:spaceId/bills',
        homeBillController.getBills
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/bills/:billId',
        homeBillController.getBill
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/bills',
        homeBillController.createBill
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/bills/:billId',
        homeBillController.updateBill
    );

    fastify.delete(
        '/users/:userId/spaces/:spaceId/bills/:billId',
        homeBillController.deleteBill
    );

    // Bill Payments
    fastify.get(
        '/users/:userId/spaces/:spaceId/bills/payments',
        homeBillController.getBillPayments
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/bills/:billId/pay',
        homeBillController.payBill
    );

    // Cost Split
    fastify.get(
        '/users/:userId/spaces/:spaceId/costs/split',
        homeBillController.getCostSplitSettings
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/costs/split',
        homeBillController.updateCostSplitSettings
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/costs/calculate',
        homeBillController.calculateCostSplit
    );

    // Cost History
    fastify.get(
        '/users/:userId/spaces/:spaceId/costs/history',
        homeBillController.getCostHistory
    );
}

module.exports = homeBillRoutes;
