const userController = require('../controllers/userController');
const { user, common } = require('../schemas');

async function userRoutes(fastify, options) {
    // Get user by ID
    fastify.get('/users/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Get user by ID',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            response: {
                200: user.userResponse,
                404: common.errorResponse
            }
        }
    }, userController.getUser);

    // Get user by email (query parameter)
    fastify.get('/users', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Get user by email',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' }
                },
                required: ['email']
            },
            response: {
                200: user.userResponse,
                404: common.errorResponse
            }
        }
    }, userController.getUserByEmail);

    // Create or update user (upsert)
    fastify.post('/users', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Create or update user',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            body: user.createUserBody,
            response: {
                200: user.userResponse,
                201: user.userResponse
            }
        }
    }, userController.upsertUser);

    // Update user onboarding status
    fastify.patch('/users/:id/onboarding', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Update user onboarding status',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: user.updateOnboardingBody,
            response: {
                200: user.userResponse,
                404: common.errorResponse
            }
        }
    }, userController.updateOnboardingStatus);

    // Update user profile
    fastify.put('/users/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Update user profile',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: user.updateUserBody,
            response: {
                200: user.userResponse,
                404: common.errorResponse
            }
        }
    }, userController.updateUser);

    // Get current user's preferences
    fastify.get('/users/me/preferences', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Get current user preferences',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                user_id: { type: 'string', format: 'uuid' },
                                default_currency: { type: 'string', enum: ['BRL', 'USD', 'EUR'] },
                                timezone: { type: 'string' },
                                language: { type: 'string' },
                                date_format: { type: 'string', enum: ['DD/MM', 'MM/DD'] },
                                week_start_day: { type: 'string', enum: ['SUN', 'MON'] },
                                theme: { type: 'string', enum: ['DARK', 'LIGHT', 'SYSTEM'] },
                                sounds_enabled: { type: 'boolean' },
                                compact_mode: { type: 'boolean' },
                                enabled_modules: { type: 'array', items: { type: 'string' } }
                            }
                        }
                    }
                }
            }
        }
    }, userController.getMyPreferences);

    // Update current user's preferences
    fastify.put('/users/me/preferences', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Update current user preferences (including modules during onboarding)',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    default_currency: { type: 'string', enum: ['BRL', 'USD', 'EUR'] },
                    timezone: { type: 'string' },
                    language: { type: 'string' },
                    date_format: { type: 'string', enum: ['DD/MM', 'MM/DD'] },
                    week_start_day: { type: 'string', enum: ['SUN', 'MON'] },
                    theme: { type: 'string', enum: ['DARK', 'LIGHT', 'SYSTEM'] },
                    sounds_enabled: { type: 'boolean' },
                    compact_mode: { type: 'boolean' },
                    enabled_modules: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['habits', 'projects', 'finance', 'health', 'study', 'home']
                        }
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                user_id: { type: 'string', format: 'uuid' },
                                default_currency: { type: 'string' },
                                timezone: { type: 'string' },
                                enabled_modules: { type: 'array', items: { type: 'string' } }
                            }
                        }
                    }
                }
            }
        }
    }, userController.updateMyPreferences);

    // Update only module settings
    fastify.put('/users/me/module-settings', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Update enabled modules for the current user',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    modules: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['habits', 'projects', 'finance', 'health', 'study', 'home']
                        },
                        description: 'Array of enabled module names'
                    }
                },
                required: ['modules']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                enabled_modules: {
                                    type: 'array',
                                    items: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                400: common.errorResponse
            }
        }
    }, userController.updateMyModuleSettings);

    // Complete onboarding - updates nickname, preferences and modules
    fastify.post('/users/me/complete-onboarding', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Complete user onboarding with nickname and preferences',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    nickname: { type: 'string', description: 'How the user wants to be called' },
                    timezone: { type: 'string' },
                    currency: { type: 'string', enum: ['BRL', 'USD', 'EUR'] },
                    modules: {
                        type: 'object',
                        properties: {
                            habits: { type: 'boolean' },
                            productivity: { type: 'boolean' },
                            finance: { type: 'boolean' },
                            health: { type: 'boolean' },
                            studies: { type: 'boolean' },
                            work: { type: 'boolean' },
                            social: { type: 'boolean' },
                            home: { type: 'boolean' }
                        }
                    }
                },
                required: ['nickname']
            },
            response: {
                200: {
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
                                        name: { type: 'string' },
                                        nickname: { type: 'string' },
                                        is_onboarded: { type: 'boolean' }
                                    }
                                },
                                preferences: {
                                    type: 'object',
                                    properties: {
                                        timezone: { type: 'string' },
                                        default_currency: { type: 'string' },
                                        enabled_modules: { type: 'array', items: { type: 'string' } }
                                    }
                                }
                            }
                        }
                    }
                },
                404: common.errorResponse
            }
        }
    }, userController.completeOnboarding);
}

module.exports = userRoutes;
