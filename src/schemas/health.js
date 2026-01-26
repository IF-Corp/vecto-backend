// Health module schemas

const mealTypeEnum = { type: 'string', enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] };
const workoutTypeEnum = { type: 'string', enum: ['CARDIO', 'STRENGTH', 'FLEXIBILITY', 'SPORTS', 'OTHER'] };
const sleepQualityEnum = { type: 'string', enum: ['POOR', 'FAIR', 'GOOD', 'EXCELLENT'] };
const sexEnum = { type: 'string', enum: ['male', 'female', 'other'] };
const activityLevelEnum = { type: 'string', enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'] };

// Health Profile schemas
const createHealthProfileBody = {
    type: 'object',
    properties: {
        birth_date: { type: 'string', format: 'date', nullable: true },
        sex: { ...sexEnum, nullable: true },
        height_cm: { type: 'number', minimum: 50, maximum: 300, nullable: true },
        activity_level: { ...activityLevelEnum, nullable: true }
    },
    additionalProperties: false
};

const updateHealthProfileBody = {
    type: 'object',
    properties: {
        birth_date: { type: 'string', format: 'date', nullable: true },
        sex: { ...sexEnum, nullable: true },
        height_cm: { type: 'number', minimum: 50, maximum: 300, nullable: true },
        activity_level: { ...activityLevelEnum, nullable: true }
    },
    additionalProperties: false
};

// Weight Log schemas
const createWeightLogBody = {
    type: 'object',
    properties: {
        date: { type: 'string', format: 'date' },
        weight_kg: { type: 'number', minimum: 20, maximum: 500 },
        body_fat_percentage: { type: 'number', minimum: 1, maximum: 70, nullable: true },
        muscle_mass_kg: { type: 'number', minimum: 10, maximum: 150, nullable: true },
        notes: { type: 'string', maxLength: 1000, nullable: true }
    },
    required: ['date', 'weight_kg'],
    additionalProperties: false
};

const updateWeightLogBody = {
    type: 'object',
    properties: {
        date: { type: 'string', format: 'date' },
        weight_kg: { type: 'number', minimum: 20, maximum: 500 },
        body_fat_percentage: { type: 'number', minimum: 1, maximum: 70, nullable: true },
        muscle_mass_kg: { type: 'number', minimum: 10, maximum: 150, nullable: true },
        notes: { type: 'string', maxLength: 1000, nullable: true }
    },
    additionalProperties: false
};

// Meal Log schemas
const createMealLogBody = {
    type: 'object',
    properties: {
        meal_type: mealTypeEnum,
        meal_date: { type: 'string', format: 'date-time' },
        description: { type: 'string', maxLength: 1000, nullable: true },
        calories: { type: 'integer', minimum: 0, nullable: true },
        protein: { type: 'number', minimum: 0, nullable: true },
        carbs: { type: 'number', minimum: 0, nullable: true },
        fat: { type: 'number', minimum: 0, nullable: true },
        photo_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true }
    },
    required: ['meal_type', 'meal_date'],
    additionalProperties: false
};

const updateMealLogBody = {
    type: 'object',
    properties: {
        meal_type: mealTypeEnum,
        meal_date: { type: 'string', format: 'date-time' },
        description: { type: 'string', maxLength: 1000, nullable: true },
        calories: { type: 'integer', minimum: 0, nullable: true },
        protein: { type: 'number', minimum: 0, nullable: true },
        carbs: { type: 'number', minimum: 0, nullable: true },
        fat: { type: 'number', minimum: 0, nullable: true },
        photo_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true }
    },
    additionalProperties: false
};

// Workout schemas
const createWorkoutBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        workout_type: workoutTypeEnum,
        workout_date: { type: 'string', format: 'date-time' },
        duration_minutes: { type: 'integer', minimum: 1, nullable: true },
        calories_burned: { type: 'integer', minimum: 0, nullable: true },
        notes: { type: 'string', maxLength: 2000, nullable: true }
    },
    required: ['name', 'workout_type', 'workout_date'],
    additionalProperties: false
};

const updateWorkoutBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        workout_type: workoutTypeEnum,
        workout_date: { type: 'string', format: 'date-time' },
        duration_minutes: { type: 'integer', minimum: 1, nullable: true },
        calories_burned: { type: 'integer', minimum: 0, nullable: true },
        notes: { type: 'string', maxLength: 2000, nullable: true }
    },
    additionalProperties: false
};

// Workout Detail schemas
const createWorkoutDetailBody = {
    type: 'object',
    properties: {
        workout_id: { type: 'string', format: 'uuid' },
        exercise_name: { type: 'string', minLength: 1, maxLength: 200 },
        sets: { type: 'integer', minimum: 1, nullable: true },
        reps: { type: 'integer', minimum: 1, nullable: true },
        weight: { type: 'number', minimum: 0, nullable: true },
        duration_seconds: { type: 'integer', minimum: 1, nullable: true }
    },
    required: ['workout_id', 'exercise_name'],
    additionalProperties: false
};

// Medication schemas
const createMedicationBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        dosage: { type: 'string', maxLength: 100, nullable: true },
        frequency: { type: 'string', maxLength: 100, nullable: true },
        schedule_times: { type: 'array', items: { type: 'string' }, default: [] },
        start_date: { type: 'string', format: 'date', nullable: true },
        end_date: { type: 'string', format: 'date', nullable: true },
        is_active: { type: 'boolean', default: true }
    },
    required: ['name'],
    additionalProperties: false
};

const updateMedicationBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        dosage: { type: 'string', maxLength: 100, nullable: true },
        frequency: { type: 'string', maxLength: 100, nullable: true },
        schedule_times: { type: 'array', items: { type: 'string' } },
        start_date: { type: 'string', format: 'date', nullable: true },
        end_date: { type: 'string', format: 'date', nullable: true },
        is_active: { type: 'boolean' }
    },
    additionalProperties: false
};

// Medication Log schemas
const createMedicationLogBody = {
    type: 'object',
    properties: {
        medication_id: { type: 'string', format: 'uuid' },
        taken_at: { type: 'string', format: 'date-time' },
        was_taken: { type: 'boolean', default: true },
        notes: { type: 'string', maxLength: 500, nullable: true }
    },
    required: ['medication_id', 'taken_at'],
    additionalProperties: false
};

// Sleep Metric schemas
const createSleepMetricBody = {
    type: 'object',
    properties: {
        sleep_date: { type: 'string', format: 'date' },
        bedtime: { type: 'string', format: 'date-time', nullable: true },
        wake_time: { type: 'string', format: 'date-time', nullable: true },
        duration_hours: { type: 'number', minimum: 0, maximum: 24, nullable: true },
        quality: sleepQualityEnum,
        notes: { type: 'string', maxLength: 1000, nullable: true }
    },
    required: ['sleep_date'],
    additionalProperties: false
};

const updateSleepMetricBody = {
    type: 'object',
    properties: {
        sleep_date: { type: 'string', format: 'date' },
        bedtime: { type: 'string', format: 'date-time', nullable: true },
        wake_time: { type: 'string', format: 'date-time', nullable: true },
        duration_hours: { type: 'number', minimum: 0, maximum: 24, nullable: true },
        quality: sleepQualityEnum,
        notes: { type: 'string', maxLength: 1000, nullable: true }
    },
    additionalProperties: false
};

module.exports = {
    // Health Profile
    createHealthProfileBody,
    updateHealthProfileBody,
    // Weight Logs
    createWeightLogBody,
    updateWeightLogBody,
    // Meal Logs
    createMealLogBody,
    updateMealLogBody,
    // Workouts
    createWorkoutBody,
    updateWorkoutBody,
    createWorkoutDetailBody,
    // Medications
    createMedicationBody,
    updateMedicationBody,
    createMedicationLogBody,
    // Sleep
    createSleepMetricBody,
    updateSleepMetricBody,
    // Enums
    sexEnum,
    activityLevelEnum,
    mealTypeEnum,
    workoutTypeEnum,
    sleepQualityEnum
};
