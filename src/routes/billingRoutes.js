const billingController = require('../controllers/billingController');
const { common } = require('../schemas');

async function billingRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== BILLING SUMMARY ====================
    fastify.get('/users/:userId/work/billing/summary', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get billing summary for a user',
            tags: ['Work - Billing'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                },
            },
        },
    }, billingController.getBillingSummary);

    // ==================== TIMESHEET REPORT ====================
    fastify.get('/users/:userId/work/billing/timesheet-report', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get timesheet report grouped by project, client, or weekday',
            tags: ['Work - Billing'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                    groupBy: { type: 'string', enum: ['project', 'client', 'weekday'] },
                },
            },
        },
    }, billingController.getTimesheetReport);

    // ==================== INVOICES ====================
    fastify.get('/users/:userId/work/invoices', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all invoices for a user',
            tags: ['Work - Billing'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['PENDING', 'INVOICED', 'PAID'] },
                    clientId: { type: 'string', format: 'uuid' },
                },
            },
        },
    }, billingController.getInvoices);

    fastify.get('/work/invoices/:id', {
        schema: {
            description: 'Get a specific invoice',
            tags: ['Work - Billing'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, billingController.getInvoice);

    fastify.post('/users/:userId/work/invoices', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create an invoice',
            tags: ['Work - Billing'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, billingController.createInvoice);

    fastify.put('/work/invoices/:id', {
        schema: {
            description: 'Update an invoice',
            tags: ['Work - Billing'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, billingController.updateInvoice);

    fastify.delete('/work/invoices/:id', {
        schema: {
            description: 'Delete an invoice',
            tags: ['Work - Billing'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, billingController.deleteInvoice);

    // ==================== INVOICE STATUS ACTIONS ====================
    fastify.post('/work/invoices/:id/mark-invoiced', {
        schema: {
            description: 'Mark an invoice as invoiced',
            tags: ['Work - Billing'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, billingController.markInvoiced);

    fastify.post('/work/invoices/:id/mark-paid', {
        schema: {
            description: 'Mark an invoice as paid',
            tags: ['Work - Billing'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, billingController.markPaid);
}

module.exports = billingRoutes;
