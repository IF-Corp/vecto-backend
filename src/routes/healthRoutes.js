const healthController = require('../controllers/healthController');
const { health, common } = require('../schemas');

async function healthRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== MEAL LOGS ====================
    fastify.get('/users/:userId/meals', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get meal logs for a user',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, healthController.getMealLogs);

    fastify.post('/users/:userId/meals', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a meal log',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: health.createMealLogBody
        }
    }, healthController.createMealLog);

    fastify.put('/meals/:id', {
        schema: {
            description: 'Update a meal log',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: health.updateMealLogBody
        }
    }, healthController.updateMealLog);

    fastify.delete('/meals/:id', {
        schema: {
            description: 'Delete a meal log',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, healthController.deleteMealLog);

    // ==================== WORKOUTS ====================
    fastify.get('/users/:userId/workouts', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get workouts for a user',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, healthController.getWorkouts);

    fastify.post('/users/:userId/workouts', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a workout',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: health.createWorkoutBody
        }
    }, healthController.createWorkout);

    fastify.put('/workouts/:id', {
        schema: {
            description: 'Update a workout',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: health.updateWorkoutBody
        }
    }, healthController.updateWorkout);

    fastify.delete('/workouts/:id', {
        schema: {
            description: 'Delete a workout',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, healthController.deleteWorkout);

    // ==================== WORKOUT DETAILS ====================
    fastify.post('/workouts/:workoutId/details', {
        schema: {
            description: 'Add workout detail',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    workoutId: { type: 'string', pattern: common.uuidPattern }
                },
                required: ['workoutId']
            },
            body: health.createWorkoutDetailBody
        }
    }, healthController.addWorkoutDetail);

    fastify.put('/workout-details/:id', {
        schema: {
            description: 'Update workout detail',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, healthController.updateWorkoutDetail);

    fastify.delete('/workout-details/:id', {
        schema: {
            description: 'Delete workout detail',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, healthController.deleteWorkoutDetail);

    // ==================== MEDICATIONS ====================
    fastify.get('/users/:userId/medications', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get medications for a user',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, healthController.getMedications);

    fastify.post('/users/:userId/medications', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a medication',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: health.createMedicationBody
        }
    }, healthController.createMedication);

    fastify.put('/medications/:id', {
        schema: {
            description: 'Update a medication',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: health.updateMedicationBody
        }
    }, healthController.updateMedication);

    fastify.delete('/medications/:id', {
        schema: {
            description: 'Delete a medication',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, healthController.deleteMedication);

    // ==================== MEDICATION LOGS ====================
    fastify.post('/medications/:medicationId/log', {
        schema: {
            description: 'Log medication intake',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    medicationId: { type: 'string', pattern: common.uuidPattern }
                },
                required: ['medicationId']
            },
            body: health.createMedicationLogBody
        }
    }, healthController.logMedication);

    fastify.delete('/medication-logs/:id', {
        schema: {
            description: 'Delete medication log',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, healthController.deleteMedicationLog);

    // ==================== SLEEP METRICS ====================
    fastify.get('/users/:userId/sleep', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get sleep metrics for a user',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, healthController.getSleepMetrics);

    fastify.post('/users/:userId/sleep', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a sleep metric',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: health.createSleepMetricBody
        }
    }, healthController.createSleepMetric);

    fastify.put('/sleep/:id', {
        schema: {
            description: 'Update a sleep metric',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: health.updateSleepMetricBody
        }
    }, healthController.updateSleepMetric);

    fastify.delete('/sleep/:id', {
        schema: {
            description: 'Delete a sleep metric',
            tags: ['Health'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, healthController.deleteSleepMetric);
}

module.exports = healthRoutes;
