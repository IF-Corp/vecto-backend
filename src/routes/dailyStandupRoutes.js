const dailyStandupController = require('../controllers/dailyStandupController');

async function dailyStandupRoutes(fastify, options) {
    // Today's standup
    fastify.get('/users/:userId/daily-standup/today', dailyStandupController.getTodayStandup);

    // Get tasks for standup
    fastify.get('/users/:userId/daily-standup/yesterday-tasks', dailyStandupController.getYesterdayTasks);
    fastify.get('/users/:userId/daily-standup/today-tasks', dailyStandupController.getTodayPendingTasks);

    // Create/update standup
    fastify.post('/users/:userId/daily-standup', dailyStandupController.createDailyStandup);
    fastify.put('/daily-standups/:id', dailyStandupController.updateDailyStandup);

    // History and trends
    fastify.get('/users/:userId/daily-standups', dailyStandupController.getStandupHistory);
    fastify.get('/users/:userId/daily-standups/energy-trends', dailyStandupController.getEnergyTrends);
}

module.exports = dailyStandupRoutes;
