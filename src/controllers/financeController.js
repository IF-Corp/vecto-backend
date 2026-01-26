const {
    Account,
    Transaction,
    RecurringExpense,
    Budget,
    Card,
    Invoice,
    FinanceCategory,
    FinanceGoal,
    GoalContribution,
    Investment,
    InvestmentHistory,
    FinanceProfile
} = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

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

// ==================== CARDS ====================

const getCards = async (request, reply) => {
    try {
        const { userId } = request.params;
        const cards = await Card.findAll({
            where: { user_id: userId, is_active: true },
            order: [['created_at', 'DESC']]
        });

        // Calculate current invoice amount for each card
        const cardsWithUsage = await Promise.all(
            cards.map(async (card) => {
                const now = new Date();
                const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                const openInvoice = await Invoice.findOne({
                    where: {
                        card_id: card.id,
                        status: { [Op.in]: ['OPEN', 'CLOSED'] },
                        reference_month: { [Op.gte]: currentMonth }
                    }
                });

                return {
                    ...card.toJSON(),
                    current_invoice_amount: openInvoice ? parseFloat(openInvoice.total_amount) : 0,
                    available_limit: card.card_limit ? parseFloat(card.card_limit) - (openInvoice ? parseFloat(openInvoice.total_amount) : 0) : null
                };
            })
        );

        return { success: true, data: cardsWithUsage };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createCard = async (request, reply) => {
    try {
        const { userId } = request.params;
        const card = await Card.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: card, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateCard = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await Card.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Card not found' };
        }
        const card = await Card.findByPk(id);
        return { success: true, data: card };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteCard = async (request, reply) => {
    try {
        const { id } = request.params;
        // Soft delete
        const [updated] = await Card.update({ is_active: false }, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Card not found' };
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
        const { userId } = request.params;
        const { startDate, endDate, categoryId, cardId, type, page = 1, limit = 20 } = request.query;

        const where = { user_id: userId };

        if (startDate && endDate) {
            where.transaction_date = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        if (categoryId) where.category_id = categoryId;
        if (cardId) where.card_id = cardId;
        if (type) where.type = type;

        const { count, rows } = await Transaction.findAndCountAll({
            where,
            include: [
                { association: 'category' },
                { association: 'card' }
            ],
            order: [['transaction_date', 'DESC']],
            offset: (page - 1) * limit,
            limit: parseInt(limit)
        });

        return {
            success: true,
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getTransactionsByAccount = async (request, reply) => {
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
        const { userId } = request.params;
        const data = request.body;

        // Handle installments
        if (data.is_installment && data.total_installments) {
            const installmentId = uuidv4();
            const installmentAmount = data.amount / data.total_installments;
            const transactions = [];

            for (let i = 1; i <= data.total_installments; i++) {
                const installmentDate = new Date(data.transaction_date);
                installmentDate.setMonth(installmentDate.getMonth() + (i - 1));

                transactions.push({
                    user_id: userId,
                    category_id: data.category_id || null,
                    card_id: data.card_id || null,
                    account_id: data.account_id || null,
                    description: `${data.description} (${i}/${data.total_installments})`,
                    amount: installmentAmount,
                    type: data.type,
                    transaction_date: installmentDate,
                    is_installment: true,
                    installment_id: installmentId,
                    current_installment: i,
                    total_installments: data.total_installments,
                    primary_category: data.primary_category,
                    secondary_category: data.secondary_category,
                    notes: data.notes
                });
            }

            await Transaction.bulkCreate(transactions);
            const createdTransactions = await Transaction.findAll({
                where: { installment_id: installmentId },
                include: [{ association: 'category' }, { association: 'card' }],
                order: [['current_installment', 'ASC']]
            });

            reply.status(201);
            return { success: true, data: createdTransactions, created: true };
        }

        // Single transaction
        const transaction = await Transaction.create({
            ...data,
            user_id: userId
        });

        const created = await Transaction.findByPk(transaction.id, {
            include: [{ association: 'category' }, { association: 'card' }]
        });

        reply.status(201);
        return { success: true, data: created, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createTransactionForAccount = async (request, reply) => {
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
        const transaction = await Transaction.findByPk(id, {
            include: [{ association: 'category' }, { association: 'card' }]
        });
        return { success: true, data: transaction };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteTransaction = async (request, reply) => {
    try {
        const { id } = request.params;
        const { deleteAll } = request.query;

        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            reply.status(404);
            return { success: false, error: 'Transaction not found' };
        }

        // Delete all installments if requested
        if (transaction.installment_id && deleteAll === 'true') {
            await Transaction.destroy({
                where: { installment_id: transaction.installment_id }
            });
            return { success: true, data: { deleted: true, message: 'All installments deleted' } };
        }

        await Transaction.destroy({ where: { id } });
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== INVOICES ====================

const getInvoices = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { month, cardId } = request.query;

        const where = { user_id: userId };

        if (month) {
            const [year, monthNum] = month.split('-').map(Number);
            const startOfMonth = new Date(year, monthNum - 1, 1);
            const endOfMonth = new Date(year, monthNum, 0);
            where.reference_month = { [Op.between]: [startOfMonth, endOfMonth] };
        }

        if (cardId) where.card_id = cardId;

        const invoices = await Invoice.findAll({
            where,
            include: [
                { association: 'card' },
                {
                    association: 'transactions',
                    include: [{ association: 'category' }]
                }
            ],
            order: [['reference_month', 'DESC']]
        });

        return { success: true, data: invoices };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createInvoice = async (request, reply) => {
    try {
        const { userId } = request.params;
        const invoice = await Invoice.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: invoice, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateInvoice = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await Invoice.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Invoice not found' };
        }
        const invoice = await Invoice.findByPk(id, {
            include: [{ association: 'card' }]
        });
        return { success: true, data: invoice };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== CATEGORIES ====================

const getCategories = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { type } = request.query;

        const where = {
            [Op.or]: [
                { user_id: userId },
                { is_default: true }
            ],
            is_active: true
        };

        if (type) where.type = type;

        const categories = await FinanceCategory.findAll({
            where,
            order: [['is_default', 'DESC'], ['name', 'ASC']]
        });

        return { success: true, data: categories };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createCategory = async (request, reply) => {
    try {
        const { userId } = request.params;
        const category = await FinanceCategory.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: category, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateCategory = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await FinanceCategory.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Category not found' };
        }
        const category = await FinanceCategory.findByPk(id);
        return { success: true, data: category };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteCategory = async (request, reply) => {
    try {
        const { id } = request.params;
        // Soft delete
        const [updated] = await FinanceCategory.update({ is_active: false }, {
            where: { id, is_default: false }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Category not found or is a default category' };
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
        const { month } = request.query;

        const where = { user_id: userId, is_active: true };

        if (month) {
            const [year, monthNum] = month.split('-').map(Number);
            where.month = new Date(year, monthNum - 1, 1);
        }

        const budgets = await Budget.findAll({
            where,
            include: [{ association: 'categoryRef' }],
            order: [['created_at', 'DESC']]
        });

        // Calculate spent amount for each budget
        const budgetsWithSpent = await Promise.all(
            budgets.map(async (budget) => {
                let spentWhere = { user_id: userId, type: 'EXPENSE' };

                if (budget.month) {
                    const startOfMonth = new Date(budget.month);
                    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0, 23, 59, 59);
                    spentWhere.transaction_date = { [Op.between]: [startOfMonth, endOfMonth] };
                }

                if (budget.category_id) {
                    spentWhere.category_id = budget.category_id;
                } else if (budget.category) {
                    spentWhere.primary_category = budget.category;
                }

                const spent = await Transaction.sum('amount', { where: spentWhere }) || 0;
                const percentage = Math.round((spent / parseFloat(budget.limit_amount)) * 100);

                return {
                    ...budget.toJSON(),
                    spent_amount: spent,
                    remaining: parseFloat(budget.limit_amount) - spent,
                    percentage,
                    is_over_budget: spent > parseFloat(budget.limit_amount),
                    is_near_limit: percentage >= budget.alert_threshold
                };
            })
        );

        return { success: true, data: budgetsWithSpent };
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

// ==================== GOALS ====================

const getGoals = async (request, reply) => {
    try {
        const { userId } = request.params;
        const goals = await FinanceGoal.findAll({
            where: { user_id: userId },
            include: [{
                association: 'contributions',
                order: [['date', 'DESC']],
                limit: 5
            }],
            order: [['status', 'ASC'], ['priority', 'DESC'], ['created_at', 'DESC']]
        });

        const goalsWithProgress = goals.map((goal) => ({
            ...goal.toJSON(),
            progress: Math.round((parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100),
            remaining: parseFloat(goal.target_amount) - parseFloat(goal.current_amount)
        }));

        return { success: true, data: goalsWithProgress };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createGoal = async (request, reply) => {
    try {
        const { userId } = request.params;
        const goal = await FinanceGoal.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: goal, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateGoal = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await FinanceGoal.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Goal not found' };
        }
        const goal = await FinanceGoal.findByPk(id);
        return { success: true, data: goal };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteGoal = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await FinanceGoal.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Goal not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const addGoalContribution = async (request, reply) => {
    try {
        const { goalId } = request.params;
        const { amount, date, notes } = request.body;

        const goal = await FinanceGoal.findByPk(goalId);
        if (!goal) {
            reply.status(404);
            return { success: false, error: 'Goal not found' };
        }

        const contribution = await GoalContribution.create({
            goal_id: goalId,
            amount,
            date: date || new Date(),
            notes
        });

        // Update goal current amount
        const newAmount = parseFloat(goal.current_amount) + parseFloat(amount);
        await goal.update({
            current_amount: newAmount,
            status: newAmount >= parseFloat(goal.target_amount) ? 'COMPLETED' : goal.status
        });

        reply.status(201);
        return { success: true, data: contribution, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== INVESTMENTS ====================

const getInvestments = async (request, reply) => {
    try {
        const { userId } = request.params;
        const investments = await Investment.findAll({
            where: { user_id: userId, is_active: true },
            include: [{
                association: 'history',
                order: [['date', 'DESC']],
                limit: 30
            }],
            order: [['current_amount', 'DESC']]
        });

        // Calculate totals
        const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.initial_amount), 0);
        const totalCurrent = investments.reduce((sum, inv) => sum + parseFloat(inv.current_amount), 0);
        const totalReturn = totalCurrent - totalInvested;
        const returnPercentage = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(2) : 0;

        return {
            success: true,
            data: investments,
            summary: {
                total_invested: totalInvested,
                total_current: totalCurrent,
                total_return: totalReturn,
                return_percentage: returnPercentage
            }
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createInvestment = async (request, reply) => {
    try {
        const { userId } = request.params;
        const investment = await Investment.create({
            ...request.body,
            user_id: userId
        });

        // Create initial history record
        await InvestmentHistory.create({
            investment_id: investment.id,
            date: request.body.start_date,
            value: request.body.initial_amount
        });

        reply.status(201);
        return { success: true, data: investment, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateInvestment = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await Investment.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Investment not found' };
        }

        // If current_amount changed, add history record
        if (request.body.current_amount) {
            await InvestmentHistory.upsert({
                investment_id: id,
                date: new Date().toISOString().split('T')[0],
                value: request.body.current_amount
            });
        }

        const investment = await Investment.findByPk(id);
        return { success: true, data: investment };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteInvestment = async (request, reply) => {
    try {
        const { id } = request.params;
        // Soft delete
        const [updated] = await Investment.update({ is_active: false }, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Investment not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== FINANCE PROFILE ====================

const getFinanceProfile = async (request, reply) => {
    try {
        const { userId } = request.params;
        let profile = await FinanceProfile.findOne({
            where: { user_id: userId }
        });

        // Create default profile if not exists
        if (!profile) {
            profile = await FinanceProfile.create({
                user_id: userId
            });
        }

        return { success: true, data: profile };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateFinanceProfile = async (request, reply) => {
    try {
        const { userId } = request.params;
        const [profile, created] = await FinanceProfile.upsert({
            ...request.body,
            user_id: userId
        });

        return { success: true, data: profile, created };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== DASHBOARD / SUMMARY ====================

const getFinanceSummary = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { month } = request.query;

        const [year, monthNum] = (month || new Date().toISOString().slice(0, 7)).split('-').map(Number);
        const startOfMonth = new Date(year, monthNum - 1, 1);
        const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

        // Get transactions for the month
        const transactions = await Transaction.findAll({
            where: {
                user_id: userId,
                transaction_date: { [Op.between]: [startOfMonth, endOfMonth] }
            }
        });

        const totalIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const balance = totalIncome - totalExpenses;

        // Get budgets with progress
        const budgets = await Budget.findAll({
            where: { user_id: userId, is_active: true, month: startOfMonth }
        });

        return {
            success: true,
            data: {
                month: { year, month: monthNum },
                total_income: totalIncome,
                total_expenses: totalExpenses,
                balance,
                transaction_count: transactions.length,
                budget_count: budgets.length
            }
        };
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
    // Cards
    getCards,
    createCard,
    updateCard,
    deleteCard,
    // Transactions
    getTransactions,
    getTransactionsByAccount,
    createTransaction,
    createTransactionForAccount,
    updateTransaction,
    deleteTransaction,
    // Invoices
    getInvoices,
    createInvoice,
    updateInvoice,
    // Categories
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    // Recurring Expenses
    getRecurringExpenses,
    createRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    // Budgets
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    // Goals
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    addGoalContribution,
    // Investments
    getInvestments,
    createInvestment,
    updateInvestment,
    deleteInvestment,
    // Finance Profile
    getFinanceProfile,
    updateFinanceProfile,
    // Summary
    getFinanceSummary
};
