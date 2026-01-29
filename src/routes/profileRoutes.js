const profileController = require('../controllers/profileController');
const { common } = require('../schemas');

async function profileRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== PROFILE ====================

    fastify.get('/users/:userId/profile', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get user profile with XP and active title',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, profileController.getProfile);

    fastify.put('/users/:userId/profile', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update user profile',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: {
                type: 'object',
                properties: {
                    photo_url: { type: 'string', nullable: true },
                    bio: { type: 'string', maxLength: 500, nullable: true },
                    phone: { type: 'string', maxLength: 20, nullable: true },
                    location: { type: 'string', maxLength: 100, nullable: true },
                    birth_date: { type: 'string', format: 'date', nullable: true },
                    timezone: { type: 'string', maxLength: 50, nullable: true },
                    gamification_enabled: { type: 'boolean' }
                }
            }
        }
    }, profileController.updateProfile);

    fastify.get('/users/:userId/profile/stats', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get profile statistics',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, profileController.getProfileStats);

    // ==================== XP & LEVELS ====================

    fastify.get('/users/:userId/profile/xp', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get XP progress and level info',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, profileController.getXpProgress);

    fastify.post('/users/:userId/profile/xp', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Add XP to user',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: {
                type: 'object',
                required: ['amount', 'source'],
                properties: {
                    amount: { type: 'integer', minimum: 1 },
                    source: {
                        type: 'string',
                        enum: [
                            'HABIT_COMPLETE',
                            'TASK_COMPLETE',
                            'STREAK_BONUS',
                            'ACHIEVEMENT',
                            'BUDGET_KEPT',
                            'STUDY_SESSION',
                            'WORKOUT_COMPLETE',
                            'FOCUS_SESSION',
                            'DAILY_LOGIN',
                            'LEVEL_UP_BONUS',
                            'OTHER'
                        ]
                    },
                    source_id: { type: 'string', format: 'uuid', nullable: true },
                    description: { type: 'string', maxLength: 200, nullable: true }
                }
            }
        }
    }, profileController.addXp);

    fastify.get('/users/:userId/profile/xp/history', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get XP history',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
                    offset: { type: 'integer', minimum: 0, default: 0 }
                }
            }
        }
    }, profileController.getXpHistory);

    // ==================== ACHIEVEMENTS ====================

    fastify.get('/users/:userId/profile/achievements', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all achievements with user progress',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    category: {
                        type: 'string',
                        enum: [
                            'HABITS', 'TASKS', 'FINANCE', 'HEALTH', 'STUDIES',
                            'WORK', 'SOCIAL', 'HOME', 'GENERAL', 'STREAK', 'MILESTONES'
                        ]
                    }
                }
            }
        }
    }, profileController.getAchievements);

    fastify.get('/users/:userId/profile/achievements/unlocked', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get user unlocked achievements',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, profileController.getUserAchievements);

    // ==================== TITLES ====================

    fastify.get('/users/:userId/profile/titles', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all titles with user unlock status',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, profileController.getTitles);

    fastify.get('/users/:userId/profile/titles/unlocked', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get user unlocked titles',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, profileController.getUserTitles);

    fastify.put('/users/:userId/profile/titles/:titleId/active', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Set active title',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['userId', 'titleId'],
                properties: {
                    userId: { type: 'string', format: 'uuid' },
                    titleId: { type: 'string', format: 'uuid' }
                }
            }
        }
    }, profileController.setActiveTitle);

    fastify.delete('/users/:userId/profile/titles/active', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Remove active title',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, profileController.removeActiveTitle);
}

module.exports = profileRoutes;
