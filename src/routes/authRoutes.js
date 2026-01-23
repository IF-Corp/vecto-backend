const authController = require('../controllers/authController');
const { auth, common } = require('../schemas');

async function authRoutes(fastify, options) {
    // Public routes - no authentication required

    fastify.post('/auth/register', {
        schema: {
            description: 'Register a new user account',
            tags: ['Auth'],
            body: auth.registerBody,
            response: {
                201: auth.authResponse,
                409: common.errorResponse
            }
        },
        config: {
            rateLimit: {
                max: 5,
                timeWindow: '1 minute'
            }
        }
    }, authController.register);

    fastify.post('/auth/login', {
        schema: {
            description: 'Login with email and password',
            tags: ['Auth'],
            body: auth.loginBody,
            response: {
                200: auth.authResponse,
                401: common.errorResponse
            }
        },
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '1 minute'
            }
        }
    }, authController.login);

    fastify.post('/auth/refresh', {
        schema: {
            description: 'Refresh access token using refresh token',
            tags: ['Auth'],
            body: auth.refreshTokenBody,
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                accessToken: { type: 'string' },
                                refreshToken: { type: 'string' }
                            }
                        }
                    }
                },
                401: common.errorResponse
            }
        }
    }, authController.refresh);

    // Protected routes - authentication required

    fastify.get('/auth/me', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Get current authenticated user',
            tags: ['Auth'],
            security: [{ bearerAuth: [] }],
            response: {
                200: auth.meResponse,
                401: common.errorResponse
            }
        }
    }, authController.me);

    fastify.post('/auth/change-password', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Change user password',
            tags: ['Auth'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    currentPassword: { type: 'string', minLength: 1 },
                    newPassword: { type: 'string', minLength: 8, maxLength: 128 }
                },
                required: ['newPassword']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' }
                    }
                },
                401: common.errorResponse
            }
        }
    }, authController.changePassword);
}

module.exports = authRoutes;
