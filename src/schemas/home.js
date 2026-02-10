// Home module schemas

const priorityEnum = { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] };
const choreFrequencyEnum = { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'AS_NEEDED'] };
const eventTypeEnum = { type: 'string', enum: ['MEETING', 'APPOINTMENT', 'REMINDER', 'SOCIAL', 'OTHER'] };

// Shopping List schemas
const createShoppingListBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        items: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer', minimum: 1 },
                    unit: { type: 'string' },
                    is_checked: { type: 'boolean' }
                }
            },
            default: []
        },
        is_completed: { type: 'boolean', default: false }
    },
    required: ['name'],
    additionalProperties: false
};

const updateShoppingListBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        items: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer', minimum: 1 },
                    unit: { type: 'string' },
                    is_checked: { type: 'boolean' }
                }
            }
        },
        is_completed: { type: 'boolean' }
    },
    additionalProperties: false
};

// Household Inventory schemas
const createInventoryBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        category: { type: 'string', maxLength: 100, nullable: true },
        quantity: { type: 'integer', minimum: 0, default: 1 },
        unit: { type: 'string', maxLength: 50, nullable: true },
        min_quantity: { type: 'integer', minimum: 0, nullable: true },
        expiry_date: { type: 'string', format: 'date', nullable: true },
        location: { type: 'string', maxLength: 200, nullable: true }
    },
    required: ['name'],
    additionalProperties: false
};

const updateInventoryBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        category: { type: 'string', maxLength: 100, nullable: true },
        quantity: { type: 'integer', minimum: 0 },
        unit: { type: 'string', maxLength: 50, nullable: true },
        min_quantity: { type: 'integer', minimum: 0, nullable: true },
        expiry_date: { type: 'string', format: 'date', nullable: true },
        location: { type: 'string', maxLength: 200, nullable: true }
    },
    additionalProperties: false
};

// Household Chore schemas
const createChoreBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 1000, nullable: true },
        frequency: choreFrequencyEnum,
        priority: priorityEnum,
        assigned_to: { type: 'string', maxLength: 100, nullable: true },
        last_completed: { type: 'string', format: 'date-time', nullable: true },
        next_due: { type: 'string', format: 'date-time', nullable: true }
    },
    required: ['name', 'frequency'],
    additionalProperties: false
};

const updateChoreBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 1000, nullable: true },
        frequency: choreFrequencyEnum,
        priority: priorityEnum,
        assigned_to: { type: 'string', maxLength: 100, nullable: true },
        last_completed: { type: 'string', format: 'date-time', nullable: true },
        next_due: { type: 'string', format: 'date-time', nullable: true }
    },
    additionalProperties: false
};

// Contact schemas
const createContactBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        email: { type: 'string', format: 'email', nullable: true },
        phone: { type: 'string', maxLength: 30, nullable: true },
        relationship: { type: 'string', maxLength: 100, nullable: true },
        birthday: { type: 'string', format: 'date', nullable: true },
        notes: { type: 'string', maxLength: 2000, nullable: true },
        photo_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        tags: { type: 'array', items: { type: 'string' }, default: [] }
    },
    required: ['name'],
    additionalProperties: false
};

const updateContactBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        email: { type: 'string', format: 'email', nullable: true },
        phone: { type: 'string', maxLength: 30, nullable: true },
        relationship: { type: 'string', maxLength: 100, nullable: true },
        birthday: { type: 'string', format: 'date', nullable: true },
        notes: { type: 'string', maxLength: 2000, nullable: true },
        photo_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        tags: { type: 'array', items: { type: 'string' } }
    },
    additionalProperties: false
};

// Calendar Event schemas
const createCalendarEventBody = {
    type: 'object',
    properties: {
        title: { type: 'string', minLength: 1, maxLength: 300 },
        description: { type: 'string', maxLength: 2000, nullable: true },
        event_type: eventTypeEnum,
        start_time: { type: 'string', format: 'date-time' },
        end_time: { type: 'string', format: 'date-time', nullable: true },
        is_all_day: { type: 'boolean', default: false },
        location: { type: 'string', maxLength: 300, nullable: true },
        reminder_minutes: { type: 'integer', minimum: 0, nullable: true },
        is_recurring: { type: 'boolean', default: false },
        recurrence_rule: { type: 'string', maxLength: 200, nullable: true }
    },
    required: ['title', 'event_type', 'start_time'],
    additionalProperties: false
};

const updateCalendarEventBody = {
    type: 'object',
    properties: {
        title: { type: 'string', minLength: 1, maxLength: 300 },
        description: { type: 'string', maxLength: 2000, nullable: true },
        event_type: eventTypeEnum,
        start_time: { type: 'string', format: 'date-time' },
        end_time: { type: 'string', format: 'date-time', nullable: true },
        is_all_day: { type: 'boolean' },
        location: { type: 'string', maxLength: 300, nullable: true },
        reminder_minutes: { type: 'integer', minimum: 0, nullable: true },
        is_recurring: { type: 'boolean' },
        recurrence_rule: { type: 'string', maxLength: 200, nullable: true }
    },
    additionalProperties: false
};

// Bill schemas
const billCategoryEnum = {
    type: 'string',
    enum: ['RENT', 'CONDO', 'ELECTRICITY', 'WATER', 'GAS', 'INTERNET', 'PHONE', 'STREAMING', 'INSURANCE', 'OTHER']
};

const createBillBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
        category: billCategoryEnum,
        average_amount: { type: 'number', minimum: 0 },
        due_day: { type: 'integer', minimum: 1, maximum: 31 },
        reminder_days_before: { type: 'integer', minimum: 0, nullable: true },
        is_active: { type: 'boolean' },
        notes: { type: 'string', nullable: true }
    },
    required: ['name', 'due_day'],
    additionalProperties: false
};

const updateBillBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
        category: billCategoryEnum,
        average_amount: { type: 'number', minimum: 0 },
        due_day: { type: 'integer', minimum: 1, maximum: 31 },
        reminder_days_before: { type: 'integer', minimum: 0, nullable: true },
        is_active: { type: 'boolean' },
        notes: { type: 'string', nullable: true }
    },
    additionalProperties: false
};

const payBillBody = {
    type: 'object',
    properties: {
        month: { type: 'integer', minimum: 1, maximum: 12 },
        year: { type: 'integer', minimum: 2000, maximum: 2100 },
        amount: { type: 'number', minimum: 0, nullable: true },
        paidByMemberId: { type: 'string', nullable: true },
        notes: { type: 'string', nullable: true }
    },
    required: ['month', 'year'],
    additionalProperties: false
};

const splitTypeEnum = { type: 'string', enum: ['EQUAL', 'CUSTOM'] };

const updateCostSplitBody = {
    type: 'object',
    properties: {
        splitType: splitTypeEnum,
        memberSplits: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    memberId: { type: 'string' },
                    percentage: { type: 'number', minimum: 0, maximum: 100 }
                },
                required: ['memberId', 'percentage']
            },
            nullable: true
        }
    },
    required: ['splitType'],
    additionalProperties: false
};

const monthYearQuery = {
    type: 'object',
    properties: {
        month: { type: 'integer', minimum: 1, maximum: 12 },
        year: { type: 'integer', minimum: 2000, maximum: 2100 }
    }
};

const costHistoryQuery = {
    type: 'object',
    properties: {
        months: { type: 'integer', minimum: 1, maximum: 24, default: 6 }
    }
};

module.exports = {
    createShoppingListBody,
    updateShoppingListBody,
    createInventoryBody,
    updateInventoryBody,
    createChoreBody,
    updateChoreBody,
    createContactBody,
    updateContactBody,
    createCalendarEventBody,
    updateCalendarEventBody,
    priorityEnum,
    choreFrequencyEnum,
    eventTypeEnum,
    billCategoryEnum,
    createBillBody,
    updateBillBody,
    payBillBody,
    splitTypeEnum,
    updateCostSplitBody,
    monthYearQuery,
    costHistoryQuery
};
