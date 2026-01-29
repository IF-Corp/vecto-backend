const socialSettingsController = require('../controllers/socialSettingsController');

async function routes(fastify) {
    fastify.get('/users/:userId/social/settings', socialSettingsController.getSettings);
    fastify.put('/users/:userId/social/settings', socialSettingsController.updateSettings);
}

module.exports = routes;
