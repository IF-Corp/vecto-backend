const homeDashboardController = require('../controllers/homeDashboardController');

async function homeDashboardRoutes(fastify, options) {
    // Home Score
    fastify.get(
        '/users/:userId/spaces/:spaceId/score',
        homeDashboardController.calculateHomeScore
    );

    // Dashboard
    fastify.get(
        '/users/:userId/spaces/:spaceId/dashboard',
        homeDashboardController.getDashboard
    );

    // Calendar
    fastify.get(
        '/users/:userId/spaces/:spaceId/calendar',
        homeDashboardController.getCalendarEvents
    );
}

module.exports = homeDashboardRoutes;
