// Finance schemas

// Enums
const accountTypeEnum = { type: 'string', enum: ['CREDIT', 'DEBIT', 'CASH', 'INVESTMENT'] };
const accountBrandEnum = { type: 'string', enum: ['VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'OTHER'] };
const cardBrandEnum = { type: 'string', enum: ['VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'OTHER'] };
const cardTypeEnum = { type: 'string', enum: ['CREDIT', 'DEBIT', 'BOTH'] };
const transactionTypeEnum = { type: 'string', enum: ['INCOME', 'EXPENSE'] };
const transactionStatusEnum = { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'CONSOLIDATED'] };
const invoiceStatusEnum = { type: 'string', enum: ['OPEN', 'CLOSED', 'PAID', 'PARTIAL', 'OVERDUE'] };
const categoryTypeEnum = { type: 'string', enum: ['EXPENSE', 'INCOME'] };
const goalPriorityEnum = { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] };
const goalStatusEnum = { type: 'string', enum: ['IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PAUSED'] };
const investmentTypeEnum = {
    type: 'string',
    enum: [
        'CDB', 'LCI', 'LCA', 'TESOURO_SELIC', 'TESOURO_IPCA', 'TESOURO_PREFIXADO', 'POUPANCA',
        'ACAO', 'FII', 'ETF', 'BDR', 'CRIPTO',
        'FUNDO_INVESTIMENTO', 'PREVIDENCIA', 'OTHER'
    ]
};
const rateTypeEnum = { type: 'string', enum: ['CDI', 'IPCA', 'PREFIXADO', 'SELIC', 'OTHER'] };
const investorProfileEnum = { type: 'string', enum: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'] };
const recurrenceTypeEnum = { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] };
const periodEnum = { type: 'string', enum: ['WEEKLY', 'MONTHLY', 'YEARLY'] };

// ==================== ACCOUNT SCHEMAS ====================
const createAccountBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        type: accountTypeEnum,
        brand: { ...accountBrandEnum, nullable: true },
        total_limit: { type: 'number', minimum: 0, nullable: true },
        closing_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true },
        due_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true }
    },
    required: ['name', 'type'],
    additionalProperties: false
};

const updateAccountBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        type: accountTypeEnum,
        brand: { ...accountBrandEnum, nullable: true },
        total_limit: { type: 'number', minimum: 0, nullable: true },
        closing_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true },
        due_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true }
    },
    additionalProperties: false
};

// ==================== CARD SCHEMAS ====================
const createCardBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        last_digits: { type: 'string', minLength: 4, maxLength: 4 },
        brand: cardBrandEnum,
        type: cardTypeEnum,
        card_limit: { type: 'number', minimum: 0, nullable: true },
        closing_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true },
        due_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true },
        color: { type: 'string', maxLength: 7, nullable: true }
    },
    required: ['name', 'last_digits', 'brand', 'type'],
    additionalProperties: false
};

const updateCardBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        last_digits: { type: 'string', minLength: 4, maxLength: 4 },
        brand: cardBrandEnum,
        type: cardTypeEnum,
        card_limit: { type: 'number', minimum: 0, nullable: true },
        closing_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true },
        due_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true },
        color: { type: 'string', maxLength: 7, nullable: true },
        is_active: { type: 'boolean' }
    },
    additionalProperties: false
};

// ==================== TRANSACTION SCHEMAS ====================
const createTransactionBody = {
    type: 'object',
    properties: {
        account_id: { type: 'string', format: 'uuid', nullable: true },
        category_id: { type: 'string', format: 'uuid', nullable: true },
        card_id: { type: 'string', format: 'uuid', nullable: true },
        description: { type: 'string', minLength: 1, maxLength: 200 },
        amount: { type: 'number', exclusiveMinimum: 0 },
        type: transactionTypeEnum,
        primary_category: { type: 'string', maxLength: 100, nullable: true },
        secondary_category: { type: 'string', maxLength: 100, nullable: true },
        transaction_date: { type: 'string', format: 'date-time' },
        is_installment: { type: 'boolean', default: false },
        total_installments: { type: 'integer', minimum: 2, maximum: 48, nullable: true },
        is_recurring: { type: 'boolean', default: false },
        status: transactionStatusEnum,
        notes: { type: 'string', maxLength: 500, nullable: true }
    },
    required: ['description', 'amount', 'type', 'transaction_date'],
    additionalProperties: false
};

const updateTransactionBody = {
    type: 'object',
    properties: {
        category_id: { type: 'string', format: 'uuid', nullable: true },
        card_id: { type: 'string', format: 'uuid', nullable: true },
        description: { type: 'string', minLength: 1, maxLength: 200 },
        amount: { type: 'number', exclusiveMinimum: 0 },
        type: transactionTypeEnum,
        primary_category: { type: 'string', maxLength: 100, nullable: true },
        secondary_category: { type: 'string', maxLength: 100, nullable: true },
        transaction_date: { type: 'string', format: 'date-time' },
        status: transactionStatusEnum,
        notes: { type: 'string', maxLength: 500, nullable: true }
    },
    additionalProperties: false
};

// ==================== INVOICE SCHEMAS ====================
const createInvoiceBody = {
    type: 'object',
    properties: {
        card_id: { type: 'string', format: 'uuid' },
        reference_month: { type: 'string', format: 'date' },
        closing_date: { type: 'string', format: 'date' },
        due_date: { type: 'string', format: 'date' }
    },
    required: ['card_id', 'reference_month', 'closing_date', 'due_date'],
    additionalProperties: false
};

const updateInvoiceBody = {
    type: 'object',
    properties: {
        status: invoiceStatusEnum,
        paid_amount: { type: 'number', minimum: 0, nullable: true },
        paid_at: { type: 'string', format: 'date-time', nullable: true }
    },
    additionalProperties: false
};

// ==================== CATEGORY SCHEMAS ====================
const createCategoryBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        type: categoryTypeEnum,
        icon: { type: 'string', maxLength: 50, nullable: true },
        color: { type: 'string', maxLength: 7, nullable: true }
    },
    required: ['name', 'type'],
    additionalProperties: false
};

const updateCategoryBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        icon: { type: 'string', maxLength: 50, nullable: true },
        color: { type: 'string', maxLength: 7, nullable: true },
        is_active: { type: 'boolean' }
    },
    additionalProperties: false
};

// ==================== BUDGET SCHEMAS ====================
const createBudgetBody = {
    type: 'object',
    properties: {
        category_id: { type: 'string', format: 'uuid', nullable: true },
        category: { type: 'string', maxLength: 100, nullable: true },
        limit_amount: { type: 'number', exclusiveMinimum: 0 },
        period: periodEnum,
        month: { type: 'string', format: 'date', nullable: true },
        start_date: { type: 'string', format: 'date', nullable: true },
        end_date: { type: 'string', format: 'date', nullable: true },
        alert_threshold: { type: 'integer', minimum: 0, maximum: 100, default: 80 }
    },
    required: ['limit_amount', 'period'],
    additionalProperties: false
};

const updateBudgetBody = {
    type: 'object',
    properties: {
        category_id: { type: 'string', format: 'uuid', nullable: true },
        category: { type: 'string', maxLength: 100, nullable: true },
        limit_amount: { type: 'number', exclusiveMinimum: 0 },
        period: periodEnum,
        month: { type: 'string', format: 'date', nullable: true },
        start_date: { type: 'string', format: 'date', nullable: true },
        end_date: { type: 'string', format: 'date', nullable: true },
        alert_threshold: { type: 'integer', minimum: 0, maximum: 100 },
        is_active: { type: 'boolean' }
    },
    additionalProperties: false
};

// ==================== RECURRING EXPENSE SCHEMAS ====================
const createRecurringExpenseBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        amount: { type: 'number', exclusiveMinimum: 0 },
        recurrence_type: recurrenceTypeEnum,
        recurrence_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true },
        category: { type: 'string', maxLength: 100, nullable: true },
        is_active: { type: 'boolean', default: true }
    },
    required: ['name', 'amount', 'recurrence_type'],
    additionalProperties: false
};

const updateRecurringExpenseBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        amount: { type: 'number', exclusiveMinimum: 0 },
        recurrence_type: recurrenceTypeEnum,
        recurrence_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true },
        category: { type: 'string', maxLength: 100, nullable: true },
        is_active: { type: 'boolean' }
    },
    additionalProperties: false
};

// ==================== GOAL SCHEMAS ====================
const createGoalBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string', maxLength: 500, nullable: true },
        icon: { type: 'string', maxLength: 50, nullable: true },
        color: { type: 'string', maxLength: 7, nullable: true },
        target_amount: { type: 'number', exclusiveMinimum: 0 },
        deadline: { type: 'string', format: 'date', nullable: true },
        priority: goalPriorityEnum
    },
    required: ['name', 'target_amount'],
    additionalProperties: false
};

const updateGoalBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string', maxLength: 500, nullable: true },
        icon: { type: 'string', maxLength: 50, nullable: true },
        color: { type: 'string', maxLength: 7, nullable: true },
        target_amount: { type: 'number', exclusiveMinimum: 0 },
        deadline: { type: 'string', format: 'date', nullable: true },
        priority: goalPriorityEnum,
        status: goalStatusEnum
    },
    additionalProperties: false
};

const createGoalContributionBody = {
    type: 'object',
    properties: {
        amount: { type: 'number', exclusiveMinimum: 0 },
        date: { type: 'string', format: 'date', nullable: true },
        notes: { type: 'string', maxLength: 200, nullable: true }
    },
    required: ['amount'],
    additionalProperties: false
};

// ==================== INVESTMENT SCHEMAS ====================
const createInvestmentBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 150 },
        type: investmentTypeEnum,
        institution: { type: 'string', maxLength: 100, nullable: true },
        initial_amount: { type: 'number', exclusiveMinimum: 0 },
        current_amount: { type: 'number', minimum: 0 },
        rate: { type: 'number', nullable: true },
        rate_type: { ...rateTypeEnum, nullable: true },
        maturity_date: { type: 'string', format: 'date', nullable: true },
        ticker: { type: 'string', maxLength: 20, nullable: true },
        quantity: { type: 'number', minimum: 0, nullable: true },
        average_price: { type: 'number', minimum: 0, nullable: true },
        start_date: { type: 'string', format: 'date' },
        notes: { type: 'string', maxLength: 500, nullable: true }
    },
    required: ['name', 'type', 'initial_amount', 'current_amount', 'start_date'],
    additionalProperties: false
};

const updateInvestmentBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 150 },
        type: investmentTypeEnum,
        institution: { type: 'string', maxLength: 100, nullable: true },
        current_amount: { type: 'number', minimum: 0 },
        rate: { type: 'number', nullable: true },
        rate_type: { ...rateTypeEnum, nullable: true },
        maturity_date: { type: 'string', format: 'date', nullable: true },
        ticker: { type: 'string', maxLength: 20, nullable: true },
        quantity: { type: 'number', minimum: 0, nullable: true },
        average_price: { type: 'number', minimum: 0, nullable: true },
        notes: { type: 'string', maxLength: 500, nullable: true },
        is_active: { type: 'boolean' }
    },
    additionalProperties: false
};

// ==================== FINANCE PROFILE SCHEMAS ====================
const createFinanceProfileBody = {
    type: 'object',
    properties: {
        investor_profile: investorProfileEnum,
        budget_fixed_percent: { type: 'integer', minimum: 0, maximum: 100 },
        budget_flex_percent: { type: 'integer', minimum: 0, maximum: 100 },
        budget_invest_percent: { type: 'integer', minimum: 0, maximum: 100 },
        monthly_income: { type: 'number', minimum: 0, nullable: true },
        alerts_enabled: { type: 'boolean' },
        weekly_report_enabled: { type: 'boolean' }
    },
    additionalProperties: false
};

const updateFinanceProfileBody = createFinanceProfileBody;

module.exports = {
    // Account
    createAccountBody,
    updateAccountBody,
    // Card
    createCardBody,
    updateCardBody,
    // Transaction
    createTransactionBody,
    updateTransactionBody,
    // Invoice
    createInvoiceBody,
    updateInvoiceBody,
    // Category
    createCategoryBody,
    updateCategoryBody,
    // Budget
    createBudgetBody,
    updateBudgetBody,
    // Recurring Expense
    createRecurringExpenseBody,
    updateRecurringExpenseBody,
    // Goal
    createGoalBody,
    updateGoalBody,
    createGoalContributionBody,
    // Investment
    createInvestmentBody,
    updateInvestmentBody,
    // Finance Profile
    createFinanceProfileBody,
    updateFinanceProfileBody,
    // Enums
    accountTypeEnum,
    accountBrandEnum,
    cardBrandEnum,
    cardTypeEnum,
    transactionTypeEnum,
    transactionStatusEnum,
    invoiceStatusEnum,
    categoryTypeEnum,
    goalPriorityEnum,
    goalStatusEnum,
    investmentTypeEnum,
    rateTypeEnum,
    investorProfileEnum,
    recurrenceTypeEnum,
    periodEnum
};
