const { Account, Transaction, RecurringExpense, Budget } = require('../models');

// ==================== ACCOUNTS ====================

const getAccounts = async (request, reply) => {
    try {
        const { userId } = request.params;
        const accounts = await Account.findAll({
            where: { user_id: userId },
            include: [{ association: 'transactions' }],
            order: [['created_at', 'DESC']]
        });
        return { success: true, data: accounts };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createAccount = async (request, reply) => {
    try {
        const { userId } = request.params;
        const account = await Account.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: account, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateAccount = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await Account.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Account not found' };
        }
        const account = await Account.findByPk(id);
        return { success: true, data: account };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteAccount = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await Account.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Account not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== TRANSACTIONS ====================

const getTransactions = async (request, reply) => {
    try {
        const { accountId } = request.params;
        const transactions = await Transaction.findAll({
            where: { account_id: accountId },
            order: [['transaction_date', 'DESC']]
        });
        return { success: true, data: transactions };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createTransaction = async (request, reply) => {
    try {
        const { accountId } = request.params;
        const transaction = await Transaction.create({
            ...request.body,
            account_id: accountId
        });
        reply.status(201);
        return { success: true, data: transaction, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateTransaction = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await Transaction.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Transaction not found' };
        }
        const transaction = await Transaction.findByPk(id);
        return { success: true, data: transaction };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteTransaction = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await Transaction.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Transaction not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== RECURRING EXPENSES ====================

const getRecurringExpenses = async (request, reply) => {
    try {
        const { userId } = request.params;
        const expenses = await RecurringExpense.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });
        return { success: true, data: expenses };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createRecurringExpense = async (request, reply) => {
    try {
        const { userId } = request.params;
        const expense = await RecurringExpense.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: expense, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateRecurringExpense = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await RecurringExpense.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Recurring expense not found' };
        }
        const expense = await RecurringExpense.findByPk(id);
        return { success: true, data: expense };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteRecurringExpense = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await RecurringExpense.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Recurring expense not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== BUDGETS ====================

const getBudgets = async (request, reply) => {
    try {
        const { userId } = request.params;
        const budgets = await Budget.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });
        return { success: true, data: budgets };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createBudget = async (request, reply) => {
    try {
        const { userId } = request.params;
        const budget = await Budget.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: budget, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateBudget = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await Budget.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Budget not found' };
        }
        const budget = await Budget.findByPk(id);
        return { success: true, data: budget };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteBudget = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await Budget.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Budget not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    // Accounts
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    // Transactions
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    // Recurring Expenses
    getRecurringExpenses,
    createRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    // Budgets
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget
};
