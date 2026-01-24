// Habit and Routine schemas

const frequencyEnum = { type: 'string', enum: ['DAILY', 'WEEKLY', 'CUSTOM'] };
const habitLogStatusEnum = { type: 'string', enum: ['DONE', 'SKIPPED', 'FAILED'] };
const rankingLogicEnum = { type: 'string', enum: ['POINTS', 'STREAK', 'CUSTOM'] };
const timePeriodEnum = { type: 'string', enum: ['morning', 'afternoon', 'evening', 'anytime'] };
const statusEnum = { type: 'string', enum: ['active', 'archived'] };

// Routine item schema (reusable)
const routineItemSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string', minLength: 1, maxLength: 200 },
        estimated_duration: { type: 'integer', minimum: 0, nullable: true },
        item_order: { type: 'integer', minimum: 0 }
    },
    required: ['title']
};

// Habit schemas
const createHabitBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 1000, nullable: true },
        category: { type: 'string', maxLength: 100, default: 'Geral' },
        context_tags: { type: 'array', items: { type: 'string' }, default: [] },
        ideal_time: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$', nullable: true },
        time_period: timePeriodEnum,
        frequency: frequencyEnum,
        frequency_days: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 6 }, default: [] },
        estimated_duration: { type: 'integer', minimum: 0, nullable: true }
    },
    required: ['name'],
    additionalProperties: false
};

const updateHabitBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 1000, nullable: true },
        category: { type: 'string', maxLength: 100 },
        context_tags: { type: 'array', items: { type: 'string' } },
        ideal_time: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$', nullable: true },
        time_period: timePeriodEnum,
        frequency: frequencyEnum,
        frequency_days: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 6 } },
        estimated_duration: { type: 'integer', minimum: 0, nullable: true },
        is_frozen: { type: 'boolean' }
    },
    additionalProperties: false
};

const logHabitBody = {
    type: 'object',
    properties: {
        status: habitLogStatusEnum,
        execution_date: { type: 'string', format: 'date-time', nullable: true }
    },
    required: ['status'],
    additionalProperties: false
};

const reactivateHabitBody = {
    type: 'object',
    properties: {
        reset_streak: { type: 'boolean', default: false }
    },
    additionalProperties: false
};

// Routine schemas
const createRoutineBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        start_time: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$', nullable: true },
        frequency: frequencyEnum,
        frequency_days: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 6 }, default: [] },
        items: { type: 'array', items: routineItemSchema, default: [] }
    },
    required: ['name'],
    additionalProperties: false
};

const updateRoutineBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        start_time: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$', nullable: true },
        frequency: frequencyEnum,
        frequency_days: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 6 } },
        items: { type: 'array', items: routineItemSchema },
        is_frozen: { type: 'boolean' }
    },
    additionalProperties: false
};

// Execution item time schema (for focus mode)
const executionItemTimeSchema = {
    type: 'object',
    properties: {
        itemId: { type: 'string', format: 'uuid' },
        itemTitle: { type: 'string', minLength: 1, maxLength: 200 },
        duration: { type: 'integer', minimum: 0 }
    },
    required: ['itemId', 'itemTitle', 'duration']
};

const logRoutineExecutionBody = {
    type: 'object',
    properties: {
        execution_date: { type: 'string', format: 'date' },
        started_at: { type: 'string', format: 'date-time' },
        completed_at: { type: 'string', format: 'date-time', nullable: true },
        total_duration: { type: 'integer', minimum: 0, nullable: true },
        completed: { type: 'boolean', default: false },
        item_times: { type: 'array', items: executionItemTimeSchema, default: [] }
    },
    required: ['execution_date', 'started_at'],
    additionalProperties: false
};

// Focus Mode schemas
const completeFocusSessionBody = {
    type: 'object',
    properties: {
        total_duration: { type: 'integer', minimum: 0 },
        item_times: { type: 'array', items: executionItemTimeSchema, default: [] }
    },
    required: ['total_duration'],
    additionalProperties: false
};

// Social Group schemas
const createSocialGroupBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        ranking_logic: rankingLogicEnum
    },
    required: ['name'],
    additionalProperties: false
};

const joinGroupBody = {
    type: 'object',
    properties: {
        user_id: { type: 'string', format: 'uuid' }
    },
    required: ['user_id'],
    additionalProperties: false
};

module.exports = {
    createHabitBody,
    updateHabitBody,
    logHabitBody,
    reactivateHabitBody,
    createRoutineBody,
    updateRoutineBody,
    logRoutineExecutionBody,
    completeFocusSessionBody,
    createSocialGroupBody,
    joinGroupBody,
    frequencyEnum,
    habitLogStatusEnum,
    rankingLogicEnum,
    timePeriodEnum,
    statusEnum
};
