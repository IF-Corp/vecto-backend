const freezeModeController = require('../controllers/freezeModeController');

async function freezeModeRoutes(fastify, options) {
    fastify.get('/users/:userId/freeze-mode', freezeModeController.getFreezeModeConfig);
    fastify.put('/users/:userId/freeze-mode', freezeModeController.updateFreezeModeConfig);
    fastify.post('/users/:userId/freeze-mode/activate', freezeModeController.activateFreezeMode);
    fastify.post('/users/:userId/freeze-mode/deactivate', freezeModeController.deactivateFreezeMode);
}

module.exports = freezeModeRoutes;
