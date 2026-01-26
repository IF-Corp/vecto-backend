const coreController = require('../controllers/coreController');
const { common } = require('../schemas');

async function coreRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== USER PREFERENCES ====================
    fastify.get('/users/:userId/preferences', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get user preferences',
            tags: ['Core'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, coreController.getPreferences);

    fastify.put('/users/:userId/preferences', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update user preferences',
            tags: ['Core'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: {
                type: 'object',
                properties: {
                    theme: { type: 'string', enum: ['LIGHT', 'DARK', 'SYSTEM'] },
                    language: { type: 'string', maxLength: 10 },
                    timezone: { type: 'string', maxLength: 50 },
                    date_format: { type: 'string', maxLength: 20 },
                    time_format: { type: 'string', enum: ['12h', '24h'] },
                    week_start: { type: 'string', enum: ['SUNDAY', 'MONDAY'] }
                }
            }
        }
    }, coreController.upsertPreferences);

    // ==================== ONBOARDING STATE ====================
    fastify.get('/users/:userId/onboarding', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get onboarding state',
            tags: ['Core'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, coreController.getOnboardingState);

    fastify.put('/users/:userId/onboarding', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update onboarding state',
            tags: ['Core'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: {
                type: 'object',
                properties: {
                    current_step: { type: 'integer', minimum: 0 },
                    completed_steps: { type: 'array', items: { type: 'string' } },
                    is_complete: { type: 'boolean' },
                    skipped_at: { type: 'string', format: 'date-time', nullable: true }
                }
            }
        }
    }, coreController.upsertOnboardingState);

    // ==================== NOTIFICATION CONFIG ====================
    fastify.get('/users/:userId/notifications', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get notification configurations',
            tags: ['Core'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, coreController.getNotificationConfigs);

    fastify.put('/users/:userId/notifications', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update notification configuration',
            tags: ['Core'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: {
                type: 'object',
                properties: {
                    type: { type: 'string', maxLength: 50 },
                    enabled: { type: 'boolean' },
                    schedule_times: { type: 'array', items: { type: 'string' } },
                    channels: { type: 'array', items: { type: 'string' } }
                }
            }
        }
    }, coreController.upsertNotificationConfig);

    fastify.delete('/notifications/:id', {
        schema: {
            description: 'Delete notification configuration',
            tags: ['Core'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, coreController.deleteNotificationConfig);
}

module.exports = coreRoutes;
