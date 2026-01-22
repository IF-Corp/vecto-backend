const coreController = require('../controllers/coreController');

async function coreRoutes(fastify, options) {
    // ==================== USER PREFERENCES ====================
    fastify.get('/users/:userId/preferences', coreController.getPreferences);
    fastify.put('/users/:userId/preferences', coreController.upsertPreferences);

    // ==================== ONBOARDING STATE ====================
    fastify.get('/users/:userId/onboarding', coreController.getOnboardingState);
    fastify.put('/users/:userId/onboarding', coreController.upsertOnboardingState);

    // ==================== GLOBAL CATEGORIES ====================
    fastify.get('/users/:userId/categories', coreController.getCategories);
    fastify.post('/users/:userId/categories', coreController.createCategory);
    fastify.put('/categories/:id', coreController.updateCategory);
    fastify.delete('/categories/:id', coreController.deleteCategory);

    // ==================== NOTIFICATION CONFIG ====================
    fastify.get('/users/:userId/notifications', coreController.getNotificationConfigs);
    fastify.put('/users/:userId/notifications', coreController.upsertNotificationConfig);
    fastify.delete('/notifications/:id', coreController.deleteNotificationConfig);
}

module.exports = coreRoutes;
