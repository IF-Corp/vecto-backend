// Freeze Mode schemas

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
        reason: { type: 'string', maxLength: 1000, nullable: true },
        end_date: { type: 'string', format: 'date-time', nullable: true },
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

module.exports = {
    updateFreezeModeBody,
    activateFreezeModeBody,
    freezeModeResponse
};
