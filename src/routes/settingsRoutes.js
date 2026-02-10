const settingsController = require('../controllers/settingsController');
const { toggleModuleBody, updateAppearanceBody, updateNotificationsBody, updatePreferencesBody, moduleTypeEnum } = require('../schemas/settings');

const uuidPattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

const userParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId'],
};

const moduleParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        moduleType: moduleTypeEnum,
    },
    required: ['userId', 'moduleType'],
};

async function routes(fastify) {
    // All Settings
    fastify.get('/users/:userId/settings',
        { schema: { params: userParams } },
        settingsController.getAllSettings
    );

    // Modules
    fastify.get('/users/:userId/settings/modules',
        { schema: { params: userParams } },
        settingsController.getModules
    );

    fastify.put('/users/:userId/settings/modules/:moduleType/toggle',
        { schema: { params: moduleParams, body: toggleModuleBody } },
        settingsController.toggleModule
    );

    // Appearance
    fastify.get('/users/:userId/settings/appearance',
        { schema: { params: userParams } },
        settingsController.getAppearance
    );

    fastify.put('/users/:userId/settings/appearance',
        { schema: { params: userParams, body: updateAppearanceBody } },
        settingsController.updateAppearance
    );

    // Notifications
    fastify.get('/users/:userId/settings/notifications',
        { schema: { params: userParams } },
        settingsController.getNotifications
    );

    fastify.put('/users/:userId/settings/notifications',
        { schema: { params: userParams, body: updateNotificationsBody } },
        settingsController.updateNotifications
    );

    // Preferences
    fastify.get('/users/:userId/settings/preferences',
        { schema: { params: userParams } },
        settingsController.getPreferences
    );

    fastify.put('/users/:userId/settings/preferences',
        { schema: { params: userParams, body: updatePreferencesBody } },
        settingsController.updatePreferences
    );
}

module.exports = routes;
