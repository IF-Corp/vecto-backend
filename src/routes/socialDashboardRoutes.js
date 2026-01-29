const socialDashboardController = require('../controllers/socialDashboardController');

async function routes(fastify) {
    fastify.get('/users/:userId/social/score', socialDashboardController.getSocialHealthScore);
    fastify.get('/users/:userId/social/dashboard', socialDashboardController.getDashboard);
    fastify.put('/users/:userId/social/battery', socialDashboardController.updateSocialBattery);
    fastify.get('/users/:userId/social/battery/history', socialDashboardController.getBatteryHistory);
}

module.exports = routes;
