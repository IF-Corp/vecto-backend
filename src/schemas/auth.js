// Authentication schemas

const registerBody = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email', maxLength: 255 },
        password: { type: 'string', minLength: 8, maxLength: 128 },
        name: { type: 'string', minLength: 2, maxLength: 100 }
    },
    required: ['email', 'password'],
    additionalProperties: false
};

const loginBody = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 1 }
    },
    required: ['email', 'password'],
    additionalProperties: false
};

const refreshTokenBody = {
    type: 'object',
    properties: {
        refreshToken: { type: 'string', minLength: 1 }
    },
    required: ['refreshToken'],
    additionalProperties: false
};

const authResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' }
                    }
                },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' }
            }
        }
    }
};

const meResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                is_onboarded: { type: 'boolean' },
                birth_date: { type: 'string', format: 'date', nullable: true },
                avatar_url: { type: 'string', nullable: true }
            }
        }
    }
};

module.exports = {
    registerBody,
    loginBody,
    refreshTokenBody,
    authResponse,
    meResponse
};
