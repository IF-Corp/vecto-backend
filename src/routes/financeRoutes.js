const financeController = require('../controllers/financeController');

async function financeRoutes(fastify, options) {
    // ==================== ACCOUNTS ====================
    fastify.get('/users/:userId/accounts', financeController.getAccounts);
    fastify.post('/users/:userId/accounts', financeController.createAccount);
    fastify.put('/accounts/:id', financeController.updateAccount);
    fastify.delete('/accounts/:id', financeController.deleteAccount);

    // ==================== TRANSACTIONS ====================
    fastify.get('/accounts/:accountId/transactions', financeController.getTransactions);
    fastify.post('/accounts/:accountId/transactions', financeController.createTransaction);
    fastify.put('/transactions/:id', financeController.updateTransaction);
    fastify.delete('/transactions/:id', financeController.deleteTransaction);

    // ==================== RECURRING EXPENSES ====================
    fastify.get('/users/:userId/recurring-expenses', financeController.getRecurringExpenses);
    fastify.post('/users/:userId/recurring-expenses', financeController.createRecurringExpense);
    fastify.put('/recurring-expenses/:id', financeController.updateRecurringExpense);
    fastify.delete('/recurring-expenses/:id', financeController.deleteRecurringExpense);

    // ==================== BUDGETS ====================
    fastify.get('/users/:userId/budgets', financeController.getBudgets);
    fastify.post('/users/:userId/budgets', financeController.createBudget);
    fastify.put('/budgets/:id', financeController.updateBudget);
    fastify.delete('/budgets/:id', financeController.deleteBudget);
}

module.exports = financeRoutes;
