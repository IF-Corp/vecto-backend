const { MealLog, Workout, WorkoutDetail, Medication, MedicationLog, SleepMetric, HealthProfile, WeightLog, Diet } = require('../models');

// ==================== HEALTH PROFILE ====================

const getHealthProfile = async (request, reply) => {
    try {
        const { userId } = request.params;
        let profile = await HealthProfile.findOne({
            where: { user_id: userId }
        });

        // Auto-create profile if doesn't exist
        if (!profile) {
            profile = await HealthProfile.create({ user_id: userId });
        }

        return { success: true, data: profile };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateHealthProfile = async (request, reply) => {
    try {
        const { userId } = request.params;

        // Clean the data - remove undefined values and convert empty strings to null
        const cleanData = {};
        for (const [key, value] of Object.entries(request.body)) {
            if (value !== undefined && value !== '') {
                cleanData[key] = value;
            } else if (value === '') {
                // Convert empty strings to null for optional fields
                cleanData[key] = null;
            }
        }

        let profile = await HealthProfile.findOne({
            where: { user_id: userId }
        });

        if (!profile) {
            // Create if doesn't exist
            profile = await HealthProfile.create({
                ...cleanData,
                user_id: userId
            });
            reply.status(201);
            return { success: true, data: profile, created: true };
        }

        await profile.update(cleanData);
        return { success: true, data: profile };
    } catch (error) {
        // Enhanced error handling
        console.error('Health Profile Update Error:', error);

        if (error.name === 'SequelizeValidationError') {
            reply.status(400);
            return {
                success: false,
                error: 'Validation error',
                details: error.errors?.map(e => ({ field: e.path, message: e.message }))
            };
        }

        if (error.name === 'SequelizeDatabaseError') {
            reply.status(400);
            return { success: false, error: 'Database error: ' + error.message };
        }

        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== WEIGHT LOGS ====================

const getWeightLogs = async (request, reply) => {
    try {
        const { userId } = request.params;
        const logs = await WeightLog.findAll({
            where: { user_id: userId },
            order: [['date', 'DESC']]
        });
        return { success: true, data: logs };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createWeightLog = async (request, reply) => {
    try {
        const { userId } = request.params;
        const log = await WeightLog.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: log, created: true };
    } catch (error) {
        // Handle unique constraint violation (one log per day)
        if (error.name === 'SequelizeUniqueConstraintError') {
            reply.status(409);
            return { success: false, error: 'Weight log already exists for this date' };
        }
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateWeightLog = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await WeightLog.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Weight log not found' };
        }
        const log = await WeightLog.findByPk(id);
        return { success: true, data: log };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteWeightLog = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await WeightLog.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Weight log not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getLatestWeight = async (request, reply) => {
    try {
        const { userId } = request.params;
        const log = await WeightLog.findOne({
            where: { user_id: userId },
            order: [['date', 'DESC']]
        });
        return { success: true, data: log };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== MEAL LOGS ====================

const getMealLogs = async (request, reply) => {
    try {
        const { userId } = request.params;
        const meals = await MealLog.findAll({
            where: { user_id: userId },
            order: [['meal_date', 'DESC']]
        });
        return { success: true, data: meals };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createMealLog = async (request, reply) => {
    try {
        const { userId } = request.params;
        const meal = await MealLog.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: meal, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateMealLog = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await MealLog.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Meal log not found' };
        }
        const meal = await MealLog.findByPk(id);
        return { success: true, data: meal };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteMealLog = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await MealLog.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Meal log not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== WORKOUTS ====================

const getWorkouts = async (request, reply) => {
    try {
        const { userId } = request.params;
        const workouts = await Workout.findAll({
            where: { user_id: userId },
            include: [{ association: 'details' }],
            order: [['workout_date', 'DESC']]
        });
        return { success: true, data: workouts };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createWorkout = async (request, reply) => {
    try {
        const { userId } = request.params;
        const workout = await Workout.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: workout, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateWorkout = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await Workout.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Workout not found' };
        }
        const workout = await Workout.findByPk(id, {
            include: [{ association: 'details' }]
        });
        return { success: true, data: workout };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteWorkout = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await Workout.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Workout not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== WORKOUT DETAILS ====================

const addWorkoutDetail = async (request, reply) => {
    try {
        const { workoutId } = request.params;
        const detail = await WorkoutDetail.create({
            ...request.body,
            workout_id: workoutId
        });
        reply.status(201);
        return { success: true, data: detail, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateWorkoutDetail = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await WorkoutDetail.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Workout detail not found' };
        }
        const detail = await WorkoutDetail.findByPk(id);
        return { success: true, data: detail };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteWorkoutDetail = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await WorkoutDetail.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Workout detail not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== MEDICATIONS ====================

const getMedications = async (request, reply) => {
    try {
        const { userId } = request.params;
        const medications = await Medication.findAll({
            where: { user_id: userId },
            include: [{ association: 'logs' }],
            order: [['created_at', 'DESC']]
        });
        return { success: true, data: medications };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createMedication = async (request, reply) => {
    try {
        const { userId } = request.params;
        const medication = await Medication.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: medication, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateMedication = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await Medication.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Medication not found' };
        }
        const medication = await Medication.findByPk(id);
        return { success: true, data: medication };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteMedication = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await Medication.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Medication not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== MEDICATION LOGS ====================

const logMedication = async (request, reply) => {
    try {
        const { medicationId } = request.params;
        const log = await MedicationLog.create({
            ...request.body,
            medication_id: medicationId
        });
        reply.status(201);
        return { success: true, data: log, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteMedicationLog = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await MedicationLog.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Medication log not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== SLEEP METRICS ====================

const getSleepMetrics = async (request, reply) => {
    try {
        const { userId } = request.params;
        const metrics = await SleepMetric.findAll({
            where: { user_id: userId },
            order: [['sleep_date', 'DESC']]
        });
        return { success: true, data: metrics };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createSleepMetric = async (request, reply) => {
    try {
        const { userId } = request.params;
        const metric = await SleepMetric.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: metric, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateSleepMetric = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await SleepMetric.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Sleep metric not found' };
        }
        const metric = await SleepMetric.findByPk(id);
        return { success: true, data: metric };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteSleepMetric = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await SleepMetric.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Sleep metric not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== DIETS ====================

const getDiets = async (request, reply) => {
    try {
        const { userId } = request.params;
        const diets = await Diet.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });
        return { success: true, data: diets };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getActiveDiet = async (request, reply) => {
    try {
        const { userId } = request.params;
        const diet = await Diet.findOne({
            where: { user_id: userId, is_active: true },
            order: [['created_at', 'DESC']]
        });
        return { success: true, data: diet };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createDiet = async (request, reply) => {
    try {
        const { userId } = request.params;

        // If this diet is active, deactivate other diets
        if (request.body.is_active !== false) {
            await Diet.update(
                { is_active: false },
                { where: { user_id: userId, is_active: true } }
            );
        }

        const diet = await Diet.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: diet, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateDiet = async (request, reply) => {
    try {
        const { id } = request.params;

        // Get the diet to find user_id
        const existingDiet = await Diet.findByPk(id);
        if (!existingDiet) {
            reply.status(404);
            return { success: false, error: 'Diet not found' };
        }

        // If activating this diet, deactivate others
        if (request.body.is_active === true) {
            await Diet.update(
                { is_active: false },
                { where: { user_id: existingDiet.user_id, is_active: true, id: { [require('sequelize').Op.ne]: id } } }
            );
        }

        await existingDiet.update(request.body);
        return { success: true, data: existingDiet };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteDiet = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await Diet.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Diet not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    // Health Profile
    getHealthProfile,
    updateHealthProfile,
    // Weight Logs
    getWeightLogs,
    createWeightLog,
    updateWeightLog,
    deleteWeightLog,
    getLatestWeight,
    // Meal Logs
    getMealLogs,
    createMealLog,
    updateMealLog,
    deleteMealLog,
    // Workouts
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    // Workout Details
    addWorkoutDetail,
    updateWorkoutDetail,
    deleteWorkoutDetail,
    // Medications
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication,
    // Medication Logs
    logMedication,
    deleteMedicationLog,
    // Sleep Metrics
    getSleepMetrics,
    createSleepMetric,
    updateSleepMetric,
    deleteSleepMetric,
    // Diets
    getDiets,
    getActiveDiet,
    createDiet,
    updateDiet,
    deleteDiet
};
