// Habit and Routine schemas

const frequencyEnum = { type: 'string', enum: ['DAILY', 'WEEKLY', 'CUSTOM'] };
const habitLogStatusEnum = { type: 'string', enum: ['DONE', 'SKIPPED', 'FAILED'] };
const rankingLogicEnum = { type: 'string', enum: ['POINTS', 'STREAK', 'CUSTOM'] };

// Habit schemas
const createHabitBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        context_tags: { type: 'array', items: { type: 'string' }, default: [] },
        ideal_time: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$', nullable: true },
        frequency: frequencyEnum,
        frequency_days: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 6 }, default: [] }
    },
    required: ['name'],
    additionalProperties: false
};

const updateHabitBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        context_tags: { type: 'array', items: { type: 'string' } },
        ideal_time: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$', nullable: true },
        frequency: frequencyEnum,
        frequency_days: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 6 } },
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

// Routine schemas
const createRoutineBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        start_time: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$', nullable: true },
        frequency: frequencyEnum,
        frequency_days: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 6 }, default: [] },
        habit_ids: { type: 'array', items: { type: 'string', format: 'uuid' } }
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
        habit_ids: { type: 'array', items: { type: 'string', format: 'uuid' } },
        is_frozen: { type: 'boolean' }
    },
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
    createRoutineBody,
    updateRoutineBody,
    createSocialGroupBody,
    joinGroupBody,
    frequencyEnum,
    habitLogStatusEnum,
    rankingLogicEnum
};
