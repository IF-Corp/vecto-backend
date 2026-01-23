// Finance schemas

const accountTypeEnum = { type: 'string', enum: ['CREDIT', 'DEBIT', 'CASH', 'INVESTMENT'] };
const transactionTypeEnum = { type: 'string', enum: ['INCOME', 'EXPENSE'] };
const transactionStatusEnum = { type: 'string', enum: ['PENDING', 'CONSOLIDATED'] };
const recurrenceTypeEnum = { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] };

// Account schemas
const createAccountBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        type: accountTypeEnum,
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
        total_limit: { type: 'number', minimum: 0, nullable: true },
        closing_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true },
        due_day: { type: 'integer', minimum: 1, maximum: 31, nullable: true }
    },
    additionalProperties: false
};

// Transaction schemas
const createTransactionBody = {
    type: 'object',
    properties: {
        account_id: { type: 'string', format: 'uuid' },
        description: { type: 'string', minLength: 1, maxLength: 500 },
        amount: { type: 'number', exclusiveMinimum: 0 },
        type: transactionTypeEnum,
        category: { type: 'string', maxLength: 100, nullable: true },
        transaction_date: { type: 'string', format: 'date-time' },
        status: transactionStatusEnum,
        tags: { type: 'array', items: { type: 'string' }, default: [] }
    },
    required: ['account_id', 'description', 'amount', 'type', 'transaction_date'],
    additionalProperties: false
};

const updateTransactionBody = {
    type: 'object',
    properties: {
        description: { type: 'string', minLength: 1, maxLength: 500 },
        amount: { type: 'number', exclusiveMinimum: 0 },
        type: transactionTypeEnum,
        category: { type: 'string', maxLength: 100, nullable: true },
        transaction_date: { type: 'string', format: 'date-time' },
        status: transactionStatusEnum,
        tags: { type: 'array', items: { type: 'string' } }
    },
    additionalProperties: false
};

// Recurring Expense schemas
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

// Budget schemas
const createBudgetBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        category: { type: 'string', maxLength: 100, nullable: true },
        limit_amount: { type: 'number', exclusiveMinimum: 0 },
        period_start: { type: 'string', format: 'date' },
        period_end: { type: 'string', format: 'date' }
    },
    required: ['name', 'limit_amount', 'period_start', 'period_end'],
    additionalProperties: false
};

const updateBudgetBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        category: { type: 'string', maxLength: 100, nullable: true },
        limit_amount: { type: 'number', exclusiveMinimum: 0 },
        period_start: { type: 'string', format: 'date' },
        period_end: { type: 'string', format: 'date' }
    },
    additionalProperties: false
};

module.exports = {
    createAccountBody,
    updateAccountBody,
    createTransactionBody,
    updateTransactionBody,
    createRecurringExpenseBody,
    updateRecurringExpenseBody,
    createBudgetBody,
    updateBudgetBody,
    accountTypeEnum,
    transactionTypeEnum,
    transactionStatusEnum,
    recurrenceTypeEnum
};
