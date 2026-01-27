const weeklyPlanController = require('../controllers/weeklyPlanController');

async function weeklyPlanRoutes(fastify, options) {
    // Get data for planning
    fastify.get('/users/:userId/weekly-plan/meetings', weeklyPlanController.getWeeklyMeetings);
    fastify.get('/users/:userId/weekly-plan/deadlines', weeklyPlanController.getWeeklyDeadlines);
    fastify.get('/users/:userId/weekly-plan/available-hours', weeklyPlanController.calculateAvailableHours);

    // Weekly plan CRUD
    fastify.get('/users/:userId/weekly-plan', weeklyPlanController.getWeeklyPlan);
    fastify.post('/users/:userId/weekly-plan', weeklyPlanController.saveWeeklyPlan);

    // Plan items
    fastify.put('/weekly-plans/:planId/items/order', weeklyPlanController.updateItemOrder);

    // Suggestions
    fastify.get('/weekly-plans/:planId/suggestions', weeklyPlanController.generatePlanSuggestions);

    // History
    fastify.get('/users/:userId/weekly-plans/history', weeklyPlanController.getPlanHistory);
}

module.exports = weeklyPlanRoutes;
