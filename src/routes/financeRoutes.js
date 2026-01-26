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

    // ==================== CARDS ====================
    fastify.get('/users/:userId/cards', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all cards for a user',
            tags: ['Finance - Cards'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, financeController.getCards);

    fastify.post('/users/:userId/cards', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new card',
            tags: ['Finance - Cards'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createCardBody
        }
    }, financeController.createCard);

    fastify.put('/cards/:id', {
        schema: {
            description: 'Update a card',
            tags: ['Finance - Cards'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateCardBody
        }
    }, financeController.updateCard);

    fastify.delete('/cards/:id', {
        schema: {
            description: 'Delete a card (soft delete)',
            tags: ['Finance - Cards'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, financeController.deleteCard);

    // ==================== TRANSACTIONS ====================
    // New user-centric routes
    fastify.get('/users/:userId/transactions', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get transactions for a user with filters',
            tags: ['Finance - Transactions'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                    categoryId: { type: 'string', format: 'uuid' },
                    cardId: { type: 'string', format: 'uuid' },
                    type: finance.transactionTypeEnum,
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
                }
            }
        }
    }, financeController.getTransactions);

    fastify.post('/users/:userId/transactions', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a transaction (supports installments)',
            tags: ['Finance - Transactions'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createTransactionBody
        }
    }, financeController.createTransaction);

    // Legacy account-centric routes (backward compatibility)
    fastify.get('/accounts/:accountId/transactions', {
        schema: {
            description: 'Get transactions for an account',
            tags: ['Finance - Transactions'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    accountId: { type: 'string', pattern: common.uuidPattern }
                },
                required: ['accountId']
            }
        }
    }, financeController.getTransactionsByAccount);

    fastify.post('/accounts/:accountId/transactions', {
        schema: {
            description: 'Create a transaction for an account',
            tags: ['Finance - Transactions'],
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
    }, financeController.createTransactionForAccount);

    fastify.put('/transactions/:id', {
        schema: {
            description: 'Update a transaction',
            tags: ['Finance - Transactions'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateTransactionBody
        }
    }, financeController.updateTransaction);

    fastify.delete('/transactions/:id', {
        schema: {
            description: 'Delete a transaction',
            tags: ['Finance - Transactions'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            querystring: {
                type: 'object',
                properties: {
                    deleteAll: { type: 'string', enum: ['true', 'false'], description: 'Delete all installments' }
                }
            }
        }
    }, financeController.deleteTransaction);

    // ==================== INVOICES ====================
    fastify.get('/users/:userId/invoices', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get invoices for a user',
            tags: ['Finance - Invoices'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    month: { type: 'string', pattern: '^\\d{4}-\\d{2}$', description: 'YYYY-MM format' },
                    cardId: { type: 'string', format: 'uuid' }
                }
            }
        }
    }, financeController.getInvoices);

    fastify.post('/users/:userId/invoices', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create an invoice',
            tags: ['Finance - Invoices'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createInvoiceBody
        }
    }, financeController.createInvoice);

    fastify.put('/invoices/:id', {
        schema: {
            description: 'Update an invoice',
            tags: ['Finance - Invoices'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateInvoiceBody
        }
    }, financeController.updateInvoice);

    // ==================== CATEGORIES ====================
    fastify.get('/users/:userId/categories', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get categories for a user (includes default categories)',
            tags: ['Finance - Categories'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    type: finance.categoryTypeEnum
                }
            }
        }
    }, financeController.getCategories);

    fastify.post('/users/:userId/categories', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a custom category',
            tags: ['Finance - Categories'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createCategoryBody
        }
    }, financeController.createCategory);

    fastify.put('/categories/:id', {
        schema: {
            description: 'Update a category',
            tags: ['Finance - Categories'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateCategoryBody
        }
    }, financeController.updateCategory);

    fastify.delete('/categories/:id', {
        schema: {
            description: 'Delete a category (soft delete, cannot delete default categories)',
            tags: ['Finance - Categories'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, financeController.deleteCategory);

    // ==================== RECURRING EXPENSES ====================
    fastify.get('/users/:userId/recurring-expenses', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get recurring expenses for a user',
            tags: ['Finance - Recurring'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, financeController.getRecurringExpenses);

    fastify.post('/users/:userId/recurring-expenses', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a recurring expense',
            tags: ['Finance - Recurring'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createRecurringExpenseBody
        }
    }, financeController.createRecurringExpense);

    fastify.put('/recurring-expenses/:id', {
        schema: {
            description: 'Update a recurring expense',
            tags: ['Finance - Recurring'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateRecurringExpenseBody
        }
    }, financeController.updateRecurringExpense);

    fastify.delete('/recurring-expenses/:id', {
        schema: {
            description: 'Delete a recurring expense',
            tags: ['Finance - Recurring'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, financeController.deleteRecurringExpense);

    // ==================== BUDGETS ====================
    fastify.get('/users/:userId/budgets', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get budgets for a user (with spent amounts calculated)',
            tags: ['Finance - Budgets'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    month: { type: 'string', pattern: '^\\d{4}-\\d{2}$', description: 'YYYY-MM format' }
                }
            }
        }
    }, financeController.getBudgets);

    fastify.post('/users/:userId/budgets', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a budget',
            tags: ['Finance - Budgets'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createBudgetBody
        }
    }, financeController.createBudget);

    fastify.put('/budgets/:id', {
        schema: {
            description: 'Update a budget',
            tags: ['Finance - Budgets'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateBudgetBody
        }
    }, financeController.updateBudget);

    fastify.delete('/budgets/:id', {
        schema: {
            description: 'Delete a budget',
            tags: ['Finance - Budgets'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, financeController.deleteBudget);

    // ==================== GOALS ====================
    fastify.get('/users/:userId/goals', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get financial goals for a user',
            tags: ['Finance - Goals'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, financeController.getGoals);

    fastify.post('/users/:userId/goals', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a financial goal',
            tags: ['Finance - Goals'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createGoalBody
        }
    }, financeController.createGoal);

    fastify.put('/goals/:id', {
        schema: {
            description: 'Update a goal',
            tags: ['Finance - Goals'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateGoalBody
        }
    }, financeController.updateGoal);

    fastify.delete('/goals/:id', {
        schema: {
            description: 'Delete a goal',
            tags: ['Finance - Goals'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, financeController.deleteGoal);

    fastify.post('/goals/:goalId/contributions', {
        schema: {
            description: 'Add a contribution to a goal',
            tags: ['Finance - Goals'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    goalId: { type: 'string', pattern: common.uuidPattern }
                },
                required: ['goalId']
            },
            body: finance.createGoalContributionBody
        }
    }, financeController.addGoalContribution);

    // ==================== INVESTMENTS ====================
    fastify.get('/users/:userId/investments', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get investments for a user (with summary)',
            tags: ['Finance - Investments'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, financeController.getInvestments);

    fastify.post('/users/:userId/investments', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create an investment',
            tags: ['Finance - Investments'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.createInvestmentBody
        }
    }, financeController.createInvestment);

    fastify.put('/investments/:id', {
        schema: {
            description: 'Update an investment',
            tags: ['Finance - Investments'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: finance.updateInvestmentBody
        }
    }, financeController.updateInvestment);

    fastify.delete('/investments/:id', {
        schema: {
            description: 'Delete an investment (soft delete)',
            tags: ['Finance - Investments'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, financeController.deleteInvestment);

    // ==================== FINANCE PROFILE ====================
    fastify.get('/users/:userId/finance-profile', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get finance profile for a user',
            tags: ['Finance - Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, financeController.getFinanceProfile);

    fastify.put('/users/:userId/finance-profile', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update finance profile',
            tags: ['Finance - Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: finance.updateFinanceProfileBody
        }
    }, financeController.updateFinanceProfile);

    // ==================== SUMMARY / DASHBOARD ====================
    fastify.get('/users/:userId/finance-summary', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get financial summary for a month',
            tags: ['Finance - Summary'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    month: { type: 'string', pattern: '^\\d{4}-\\d{2}$', description: 'YYYY-MM format' }
                }
            }
        }
    }, financeController.getFinanceSummary);
}

module.exports = financeRoutes;
