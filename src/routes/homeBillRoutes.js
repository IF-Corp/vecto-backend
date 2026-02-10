const homeBillController = require('../controllers/homeBillController');
const { createBillBody, updateBillBody, payBillBody, updateCostSplitBody, monthYearQuery, costHistoryQuery } = require('../schemas/home');

const uuidPattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

const spaceParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId'],
};

const billParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
        billId: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId', 'billId'],
};

async function homeBillRoutes(fastify, options) {
    // Bills CRUD
    fastify.get(
        '/users/:userId/spaces/:spaceId/bills',
        { schema: { params: spaceParams } },
        homeBillController.getBills
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/bills/:billId',
        { schema: { params: billParams } },
        homeBillController.getBill
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/bills',
        { schema: { params: spaceParams, body: createBillBody } },
        homeBillController.createBill
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/bills/:billId',
        { schema: { params: billParams, body: updateBillBody } },
        homeBillController.updateBill
    );

    fastify.delete(
        '/users/:userId/spaces/:spaceId/bills/:billId',
        { schema: { params: billParams } },
        homeBillController.deleteBill
    );

    // Bill Payments
    fastify.get(
        '/users/:userId/spaces/:spaceId/bills/payments',
        { schema: { params: spaceParams, querystring: monthYearQuery } },
        homeBillController.getBillPayments
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/bills/:billId/pay',
        { schema: { params: billParams, body: payBillBody } },
        homeBillController.payBill
    );

    // Cost Split
    fastify.get(
        '/users/:userId/spaces/:spaceId/costs/split',
        { schema: { params: spaceParams } },
        homeBillController.getCostSplitSettings
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/costs/split',
        { schema: { params: spaceParams, body: updateCostSplitBody } },
        homeBillController.updateCostSplitSettings
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/costs/calculate',
        { schema: { params: spaceParams, querystring: monthYearQuery } },
        homeBillController.calculateCostSplit
    );

    // Cost History
    fastify.get(
        '/users/:userId/spaces/:spaceId/costs/history',
        { schema: { params: spaceParams, querystring: costHistoryQuery } },
        homeBillController.getCostHistory
    );
}

module.exports = homeBillRoutes;
