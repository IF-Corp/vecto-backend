// Freeze Mode schemas

// ==================== ENUMS ====================

const freezeStatusEnum = ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
const freezeReasonEnum = ['VACATION', 'TRAVEL', 'ILLNESS', 'INTENSE_PROJECT', 'MENTAL_REST', 'OTHER'];
const moduleTypeEnum = ['HABITS', 'TASKS', 'FINANCE', 'HEALTH', 'STUDIES', 'WORK', 'SOCIAL', 'HOME'];

// ==================== LEGACY SCHEMAS ====================

const updateFreezeModeBody = {
    type: 'object',
    properties: {
        start_date: { type: 'string', format: 'date-time', nullable: true },
        end_date: { type: 'string', format: 'date-time', nullable: true },
        reason: { type: 'string', maxLength: 1000, nullable: true },
        pause_habits: { type: 'boolean', default: true },
        pause_tasks: { type: 'boolean', default: true },
        pause_notifications: { type: 'boolean', default: true },
        auto_resume: { type: 'boolean', default: false }
    },
    additionalProperties: false
};

const activateFreezeModeBody = {
    type: 'object',
    properties: {
        reason: { type: 'string', enum: freezeReasonEnum, nullable: true },
        end_date: { type: 'string', format: 'date', nullable: true },
        pause_habits: { type: 'boolean', default: true },
        pause_tasks: { type: 'boolean', default: true },
        pause_notifications: { type: 'boolean', default: true },
        auto_resume: { type: 'boolean', default: false }
    },
    additionalProperties: false
};

const freezeModeResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                user_id: { type: 'string' },
                is_active: { type: 'boolean' },
                start_date: { type: 'string', nullable: true },
                end_date: { type: 'string', nullable: true },
                reason: { type: 'string', nullable: true },
                pause_habits: { type: 'boolean' },
                pause_tasks: { type: 'boolean' },
                pause_notifications: { type: 'boolean' },
                auto_resume: { type: 'boolean' }
            }
        }
    }
};

// ==================== FREEZE PERIOD SCHEMAS ====================

const freezeOptionsSchema = {
    type: 'object',
    properties: {
        freeze_streaks: { type: 'boolean', default: true },
        hide_non_essential_tasks: { type: 'boolean', default: true },
        pause_general_notifications: { type: 'boolean', default: true },
        pause_goals: { type: 'boolean', default: true },
        keep_important_events: { type: 'boolean', default: true }
    }
};

const freezePeriodSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        user_id: { type: 'string', format: 'uuid' },
        start_date: { type: 'string', format: 'date' },
        end_date: { type: 'string', format: 'date' },
        reason: { type: 'string', enum: freezeReasonEnum, nullable: true },
        reason_custom: { type: 'string', nullable: true },
        status: { type: 'string', enum: freezeStatusEnum },
        activated_at: { type: 'string', nullable: true },
        deactivated_at: { type: 'string', nullable: true },
        modules: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    freeze_period_id: { type: 'string' },
                    module_type: { type: 'string', enum: moduleTypeEnum }
                }
            }
        },
        options: freezeOptionsSchema,
        created_at: { type: 'string' },
        updated_at: { type: 'string' }
    }
};

const createFreezePeriodBody = {
    type: 'object',
    required: ['start_date', 'end_date'],
    properties: {
        start_date: { type: 'string', format: 'date' },
        end_date: { type: 'string', format: 'date' },
        reason: { type: 'string', enum: freezeReasonEnum, nullable: true },
        reason_custom: { type: 'string', maxLength: 500, nullable: true },
        modules: {
            type: 'array',
            items: { type: 'string', enum: moduleTypeEnum }
        },
        options: freezeOptionsSchema,
        activate_immediately: { type: 'boolean', default: false }
    },
    additionalProperties: false
};

const updateFreezePeriodBody = {
    type: 'object',
    properties: {
        start_date: { type: 'string', format: 'date' },
        end_date: { type: 'string', format: 'date' },
        reason: { type: 'string', enum: freezeReasonEnum, nullable: true },
        reason_custom: { type: 'string', maxLength: 500, nullable: true },
        modules: {
            type: 'array',
            items: { type: 'string', enum: moduleTypeEnum }
        },
        options: freezeOptionsSchema
    },
    additionalProperties: false
};

const freezePeriodResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: { ...freezePeriodSchema, nullable: true }
    }
};

const freezePeriodsListResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'array',
            items: freezePeriodSchema
        },
        total: { type: 'integer' },
        limit: { type: 'integer' },
        offset: { type: 'integer' }
    }
};

const freezeStatisticsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'object',
            properties: {
                total_periods: { type: 'integer' },
                completed_periods: { type: 'integer' },
                scheduled_periods: { type: 'integer' },
                total_frozen_days: { type: 'integer' },
                is_frozen: { type: 'boolean' },
                active_period: { ...freezePeriodSchema, nullable: true }
            }
        }
    }
};

const freezePeriodIdParams = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'string', format: 'uuid' }
    }
};

const freezePeriodsQuerystring = {
    type: 'object',
    properties: {
        status: { type: 'string', enum: freezeStatusEnum },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        offset: { type: 'integer', minimum: 0, default: 0 }
    }
};

module.exports = {
    // Legacy
    updateFreezeModeBody,
    activateFreezeModeBody,
    freezeModeResponse,
    // Freeze Periods
    createFreezePeriodBody,
    updateFreezePeriodBody,
    freezePeriodResponse,
    freezePeriodsListResponse,
    freezeStatisticsResponse,
    freezePeriodIdParams,
    freezePeriodsQuerystring,
    // Enums for reference
    freezeStatusEnum,
    freezeReasonEnum,
    moduleTypeEnum
};
