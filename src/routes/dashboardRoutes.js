const dashboardController = require('../controllers/dashboardController');
const common = require('../schemas/common');

async function routes(fastify) {
    const userIdSchema = { schema: { params: common.userIdParams } };

    // Dashboard Overview
    fastify.get('/users/:userId/dashboard', userIdSchema, dashboardController.getDashboardOverview);

    // Settings
    fastify.get('/users/:userId/dashboard/settings', userIdSchema, dashboardController.getSettings);
    fastify.put('/users/:userId/dashboard/settings', userIdSchema, dashboardController.updateSettings);

    // Quick Stats
    fastify.get('/users/:userId/dashboard/quick-stats', userIdSchema, dashboardController.getQuickStats);
    fastify.put('/users/:userId/dashboard/quick-stats', userIdSchema, dashboardController.updateQuickStats);
    fastify.get('/users/:userId/dashboard/quick-stats/data', userIdSchema, dashboardController.getQuickStatsData);

    // Widgets
    fastify.get('/users/:userId/dashboard/widgets', userIdSchema, dashboardController.getWidgets);
    fastify.put('/users/:userId/dashboard/widgets', userIdSchema, dashboardController.updateWidgets);

    // Alerts
    fastify.get('/users/:userId/dashboard/alerts', userIdSchema, dashboardController.getAlerts);
    fastify.get('/users/:userId/dashboard/alerts/settings', userIdSchema, dashboardController.getAlertSettings);
    fastify.put('/users/:userId/dashboard/alerts/settings', userIdSchema, dashboardController.updateAlertSettings);
}

module.exports = routes;
