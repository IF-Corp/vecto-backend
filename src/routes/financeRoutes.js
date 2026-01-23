const financeController = require('../controllers/financeController');
const { finance, common } = require('../schemas');

async function financeRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== ACCOUNTS ====================
    fastify.get('/users/:userId/accounts', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all accounts for a user',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, financeController.getAccounts);

    fastify.post('/users/:userId/accounts', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new account',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createAccountBody
        }
    }, financeController.createAccount);

    fastify.put('/accounts/:id', {
        schema: {
            description: 'Update an account',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateAccountBody
        }
    }, financeController.updateAccount);

    fastify.delete('/accounts/:id', {
        schema: {
            description: 'Delete an account',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, financeController.deleteAccount);

    // ==================== TRANSACTIONS ====================
    fastify.get('/accounts/:accountId/transactions', {
        schema: {
            description: 'Get transactions for an account',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    accountId: { type: 'string', pattern: common.uuidPattern }
                },
                required: ['accountId']
            }
        }
    }, financeController.getTransactions);

    fastify.post('/accounts/:accountId/transactions', {
        schema: {
            description: 'Create a transaction',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    accountId: { type: 'string', pattern: common.uuidPattern }
                },
                required: ['accountId']
            },
            body: finance.createTransactionBody
        }
    }, financeController.createTransaction);

    fastify.put('/transactions/:id', {
        schema: {
            description: 'Update a transaction',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateTransactionBody
        }
    }, financeController.updateTransaction);

    fastify.delete('/transactions/:id', {
        schema: {
            description: 'Delete a transaction',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, financeController.deleteTransaction);

    // ==================== RECURRING EXPENSES ====================
    fastify.get('/users/:userId/recurring-expenses', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get recurring expenses for a user',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, financeController.getRecurringExpenses);

    fastify.post('/users/:userId/recurring-expenses', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a recurring expense',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createRecurringExpenseBody
        }
    }, financeController.createRecurringExpense);

    fastify.put('/recurring-expenses/:id', {
        schema: {
            description: 'Update a recurring expense',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateRecurringExpenseBody
        }
    }, financeController.updateRecurringExpense);

    fastify.delete('/recurring-expenses/:id', {
        schema: {
            description: 'Delete a recurring expense',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, financeController.deleteRecurringExpense);

    // ==================== BUDGETS ====================
    fastify.get('/users/:userId/budgets', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get budgets for a user',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, financeController.getBudgets);

    fastify.post('/users/:userId/budgets', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a budget',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createBudgetBody
        }
    }, financeController.createBudget);

    fastify.put('/budgets/:id', {
        schema: {
            description: 'Update a budget',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateBudgetBody
        }
    }, financeController.updateBudget);

    fastify.delete('/budgets/:id', {
        schema: {
            description: 'Delete a budget',
            tags: ['Finance'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, financeController.deleteBudget);
}

module.exports = financeRoutes;
