// User schemas

const { uuidPattern } = require('./common');

const createUserBody = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email', maxLength: 255 },
        name: { type: 'string', minLength: 2, maxLength: 100 }
    },
    required: ['email'],
    additionalProperties: false
};

const updateUserBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 2, maxLength: 100 },
        birth_date: { type: 'string', format: 'date', nullable: true },
        avatar_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true }
    },
    additionalProperties: false
};

const updateOnboardingBody = {
    type: 'object',
    properties: {
        is_onboarded: { type: 'boolean' }
    },
    required: ['is_onboarded'],
    additionalProperties: false
};

const userResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string', nullable: true },
                is_onboarded: { type: 'boolean' },
                birth_date: { type: 'string', nullable: true },
                avatar_url: { type: 'string', nullable: true },
                created_at: { type: 'string' },
                updated_at: { type: 'string' }
            }
        }
    }
};

module.exports = {
    createUserBody,
    updateUserBody,
    updateOnboardingBody,
    userResponse
};
