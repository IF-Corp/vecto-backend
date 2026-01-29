const settingsController = require('../controllers/settingsController');

async function routes(fastify) {
    // All Settings
    fastify.get('/users/:userId/settings', settingsController.getAllSettings);

    // Modules
    fastify.get('/users/:userId/settings/modules', settingsController.getModules);
    fastify.put('/users/:userId/settings/modules/:moduleType/toggle', settingsController.toggleModule);

    // Appearance
    fastify.get('/users/:userId/settings/appearance', settingsController.getAppearance);
    fastify.put('/users/:userId/settings/appearance', settingsController.updateAppearance);

    // Notifications
    fastify.get('/users/:userId/settings/notifications', settingsController.getNotifications);
    fastify.put('/users/:userId/settings/notifications', settingsController.updateNotifications);

    // Preferences
    fastify.get('/users/:userId/settings/preferences', settingsController.getPreferences);
    fastify.put('/users/:userId/settings/preferences', settingsController.updatePreferences);
}

module.exports = routes;
