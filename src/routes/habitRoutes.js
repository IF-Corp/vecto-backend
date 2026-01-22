const habitController = require('../controllers/habitController');

async function habitRoutes(fastify, options) {
    // ==================== HABITS ====================
    fastify.get('/users/:userId/habits', habitController.getHabits);
    fastify.post('/users/:userId/habits', habitController.createHabit);
    fastify.put('/habits/:id', habitController.updateHabit);
    fastify.delete('/habits/:id', habitController.deleteHabit);
    fastify.post('/habits/:id/log', habitController.logHabit);

    // ==================== ROUTINES ====================
    fastify.get('/users/:userId/routines', habitController.getRoutines);
    fastify.post('/users/:userId/routines', habitController.createRoutine);
    fastify.put('/routines/:id', habitController.updateRoutine);
    fastify.delete('/routines/:id', habitController.deleteRoutine);

    // ==================== SOCIAL GROUPS ====================
    fastify.get('/social-groups', habitController.getSocialGroups);
    fastify.post('/social-groups', habitController.createSocialGroup);
    fastify.post('/social-groups/:id/join', habitController.joinGroup);
    fastify.post('/social-groups/:id/leave', habitController.leaveGroup);
    fastify.get('/social-groups/:id/ranking', habitController.getGroupRanking);
}

module.exports = habitRoutes;
