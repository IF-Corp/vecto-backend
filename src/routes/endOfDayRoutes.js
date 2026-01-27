const endOfDayController = require('../controllers/endOfDayController');

async function endOfDayRoutes(fastify, options) {
    // Get data for end of day review
    fastify.get('/users/:userId/end-of-day/tasks-completion', endOfDayController.getTodayTasksCompletion);
    fastify.get('/users/:userId/end-of-day/hours-worked', endOfDayController.getTodayWorkedHours);

    // Move uncompleted tasks
    fastify.post('/users/:userId/end-of-day/move-tasks', endOfDayController.moveUncompletedTasksToTomorrow);

    // Create/get review
    fastify.post('/users/:userId/end-of-day', endOfDayController.createEndOfDayReview);
    fastify.get('/users/:userId/end-of-day/today', endOfDayController.getTodayReview);

    // History and trends
    fastify.get('/users/:userId/end-of-day/history', endOfDayController.getReviewHistory);
    fastify.get('/users/:userId/end-of-day/productivity-trends', endOfDayController.getProductivityTrends);
}

module.exports = endOfDayRoutes;
