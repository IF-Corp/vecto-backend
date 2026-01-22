const healthController = require('../controllers/healthController');

async function healthRoutes(fastify, options) {
    // ==================== MEAL LOGS ====================
    fastify.get('/users/:userId/meals', healthController.getMealLogs);
    fastify.post('/users/:userId/meals', healthController.createMealLog);
    fastify.put('/meals/:id', healthController.updateMealLog);
    fastify.delete('/meals/:id', healthController.deleteMealLog);

    // ==================== WORKOUTS ====================
    fastify.get('/users/:userId/workouts', healthController.getWorkouts);
    fastify.post('/users/:userId/workouts', healthController.createWorkout);
    fastify.put('/workouts/:id', healthController.updateWorkout);
    fastify.delete('/workouts/:id', healthController.deleteWorkout);

    // ==================== WORKOUT DETAILS ====================
    fastify.post('/workouts/:workoutId/details', healthController.addWorkoutDetail);
    fastify.put('/workout-details/:id', healthController.updateWorkoutDetail);
    fastify.delete('/workout-details/:id', healthController.deleteWorkoutDetail);

    // ==================== MEDICATIONS ====================
    fastify.get('/users/:userId/medications', healthController.getMedications);
    fastify.post('/users/:userId/medications', healthController.createMedication);
    fastify.put('/medications/:id', healthController.updateMedication);
    fastify.delete('/medications/:id', healthController.deleteMedication);

    // ==================== MEDICATION LOGS ====================
    fastify.post('/medications/:medicationId/log', healthController.logMedication);
    fastify.delete('/medication-logs/:id', healthController.deleteMedicationLog);

    // ==================== SLEEP METRICS ====================
    fastify.get('/users/:userId/sleep', healthController.getSleepMetrics);
    fastify.post('/users/:userId/sleep', healthController.createSleepMetric);
    fastify.put('/sleep/:id', healthController.updateSleepMetric);
    fastify.delete('/sleep/:id', healthController.deleteSleepMetric);
}

module.exports = healthRoutes;
