const dashboardController = require('../controllers/dashboardController');

async function routes(fastify) {
    // Dashboard Overview
    fastify.get('/users/:userId/dashboard', dashboardController.getDashboardOverview);

    // Settings
    fastify.get('/users/:userId/dashboard/settings', dashboardController.getSettings);
    fastify.put('/users/:userId/dashboard/settings', dashboardController.updateSettings);

    // Quick Stats
    fastify.get('/users/:userId/dashboard/quick-stats', dashboardController.getQuickStats);
    fastify.put('/users/:userId/dashboard/quick-stats', dashboardController.updateQuickStats);
    fastify.get('/users/:userId/dashboard/quick-stats/data', dashboardController.getQuickStatsData);

    // Widgets
    fastify.get('/users/:userId/dashboard/widgets', dashboardController.getWidgets);
    fastify.put('/users/:userId/dashboard/widgets', dashboardController.updateWidgets);

    // Alerts
    fastify.get('/users/:userId/dashboard/alerts', dashboardController.getAlerts);
    fastify.get('/users/:userId/dashboard/alerts/settings', dashboardController.getAlertSettings);
    fastify.put('/users/:userId/dashboard/alerts/settings', dashboardController.updateAlertSettings);
}

module.exports = routes;
