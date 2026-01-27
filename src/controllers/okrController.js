const db = require('../models');
const { WorkObjective, WorkKeyResult, WorkKeyResultUpdate } = db;

// ==================== OBJECTIVES ====================

const getObjectives = async (request, reply) => {
    const { userId } = request.params;
    const { status, area, periodStart, periodEnd } = request.query;

    const where = { user_id: userId };

    if (status) where.status = status;
    if (area) where.area = area;
    if (periodStart && periodEnd) {
        where.period_start = { [db.Sequelize.Op.gte]: periodStart };
        where.period_end = { [db.Sequelize.Op.lte]: periodEnd };
    }

    const objectives = await WorkObjective.findAll({
        where,
        include: [{
            model: WorkKeyResult,
            as: 'keyResults',
            attributes: ['id', 'description', 'metric_type', 'start_value', 'target_value', 'current_value', 'unit', 'progress'],
        }],
        order: [['period_start', 'DESC'], ['created_at', 'DESC']],
    });

    return reply.send({ data: objectives });
};

const getObjective = async (request, reply) => {
    const { id } = request.params;

    const objective = await WorkObjective.findByPk(id, {
        include: [{
            model: WorkKeyResult,
            as: 'keyResults',
            include: [{
                model: WorkKeyResultUpdate,
                as: 'updates',
                order: [['created_at', 'DESC']],
                limit: 10,
            }],
        }],
    });

    if (!objective) {
        return reply.code(404).send({ error: 'Objective not found' });
    }

    return reply.send({ data: objective });
};

const createObjective = async (request, reply) => {
    const { userId } = request.params;
    const { title, description, periodType, periodStart, periodEnd, area, status } = request.body;

    const objective = await WorkObjective.create({
        user_id: userId,
        title,
        description,
        period_type: periodType || 'QUARTERLY',
        period_start: periodStart,
        period_end: periodEnd,
        area: area || 'CAREER',
        status: status || 'DRAFT',
    });

    return reply.code(201).send({ data: objective });
};

const updateObjective = async (request, reply) => {
    const { id } = request.params;
    const updates = request.body;

    const objective = await WorkObjective.findByPk(id);

    if (!objective) {
        return reply.code(404).send({ error: 'Objective not found' });
    }

    // Convert camelCase to snake_case for database
    const dbUpdates = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.periodType !== undefined) dbUpdates.period_type = updates.periodType;
    if (updates.periodStart !== undefined) dbUpdates.period_start = updates.periodStart;
    if (updates.periodEnd !== undefined) dbUpdates.period_end = updates.periodEnd;
    if (updates.area !== undefined) dbUpdates.area = updates.area;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    await objective.update(dbUpdates);

    return reply.send({ data: objective });
};

const deleteObjective = async (request, reply) => {
    const { id } = request.params;

    const objective = await WorkObjective.findByPk(id);

    if (!objective) {
        return reply.code(404).send({ error: 'Objective not found' });
    }

    await objective.destroy();

    return reply.send({ message: 'Objective deleted successfully' });
};

// ==================== KEY RESULTS ====================

const getKeyResults = async (request, reply) => {
    const { objectiveId } = request.params;

    const keyResults = await WorkKeyResult.findAll({
        where: { objective_id: objectiveId },
        include: [{
            model: WorkKeyResultUpdate,
            as: 'updates',
            order: [['created_at', 'DESC']],
            limit: 5,
        }],
        order: [['created_at', 'ASC']],
    });

    return reply.send({ data: keyResults });
};

const createKeyResult = async (request, reply) => {
    const { objectiveId } = request.params;
    const { description, metricType, startValue, targetValue, unit } = request.body;

    // Verify objective exists
    const objective = await WorkObjective.findByPk(objectiveId);
    if (!objective) {
        return reply.code(404).send({ error: 'Objective not found' });
    }

    const keyResult = await WorkKeyResult.create({
        objective_id: objectiveId,
        description,
        metric_type: metricType || 'NUMERIC',
        start_value: startValue || 0,
        target_value: targetValue,
        current_value: startValue || 0,
        unit,
        progress: 0,
    });

    // Update objective progress
    await updateObjectiveProgress(objectiveId);

    return reply.code(201).send({ data: keyResult });
};

const updateKeyResult = async (request, reply) => {
    const { id } = request.params;
    const updates = request.body;

    const keyResult = await WorkKeyResult.findByPk(id);

    if (!keyResult) {
        return reply.code(404).send({ error: 'Key Result not found' });
    }

    // Convert camelCase to snake_case for database
    const dbUpdates = {};
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.metricType !== undefined) dbUpdates.metric_type = updates.metricType;
    if (updates.startValue !== undefined) dbUpdates.start_value = updates.startValue;
    if (updates.targetValue !== undefined) dbUpdates.target_value = updates.targetValue;
    if (updates.unit !== undefined) dbUpdates.unit = updates.unit;

    await keyResult.update(dbUpdates);

    // Recalculate progress if values changed
    if (updates.startValue !== undefined || updates.targetValue !== undefined) {
        const progress = WorkKeyResult.calculateProgress(
            keyResult.start_value,
            keyResult.target_value,
            keyResult.current_value,
            keyResult.metric_type
        );
        await keyResult.update({ progress });
        await updateObjectiveProgress(keyResult.objective_id);
    }

    return reply.send({ data: keyResult });
};

const deleteKeyResult = async (request, reply) => {
    const { id } = request.params;

    const keyResult = await WorkKeyResult.findByPk(id);

    if (!keyResult) {
        return reply.code(404).send({ error: 'Key Result not found' });
    }

    const objectiveId = keyResult.objective_id;
    await keyResult.destroy();

    // Update objective progress
    await updateObjectiveProgress(objectiveId);

    return reply.send({ message: 'Key Result deleted successfully' });
};

// ==================== KEY RESULT UPDATES ====================

const updateKeyResultValue = async (request, reply) => {
    const { id } = request.params;
    const { newValue, notes } = request.body;

    const keyResult = await WorkKeyResult.findByPk(id);

    if (!keyResult) {
        return reply.code(404).send({ error: 'Key Result not found' });
    }

    const previousValue = keyResult.current_value;

    // Create update record
    await WorkKeyResultUpdate.create({
        key_result_id: id,
        previous_value: previousValue,
        new_value: newValue,
        notes,
    });

    // Calculate new progress
    const progress = WorkKeyResult.calculateProgress(
        keyResult.start_value,
        keyResult.target_value,
        newValue,
        keyResult.metric_type
    );

    // Update key result
    await keyResult.update({
        current_value: newValue,
        progress,
    });

    // Update objective progress
    await updateObjectiveProgress(keyResult.objective_id);

    // Fetch updated key result with updates
    const updated = await WorkKeyResult.findByPk(id, {
        include: [{
            model: WorkKeyResultUpdate,
            as: 'updates',
            order: [['created_at', 'DESC']],
            limit: 10,
        }],
    });

    return reply.send({ data: updated });
};

const getKeyResultHistory = async (request, reply) => {
    const { id } = request.params;

    const updates = await WorkKeyResultUpdate.findAll({
        where: { key_result_id: id },
        order: [['created_at', 'DESC']],
    });

    return reply.send({ data: updates });
};

// ==================== HELPER FUNCTIONS ====================

const updateObjectiveProgress = async (objectiveId) => {
    const keyResults = await WorkKeyResult.findAll({
        where: { objective_id: objectiveId },
    });

    if (keyResults.length === 0) {
        await WorkObjective.update({ progress: 0 }, { where: { id: objectiveId } });
        return;
    }

    // Calculate average progress of all key results
    const totalProgress = keyResults.reduce((sum, kr) => sum + parseFloat(kr.progress || 0), 0);
    const avgProgress = totalProgress / keyResults.length;

    await WorkObjective.update(
        { progress: Math.round(avgProgress * 100) / 100 },
        { where: { id: objectiveId } }
    );
};

module.exports = {
    getObjectives,
    getObjective,
    createObjective,
    updateObjective,
    deleteObjective,
    getKeyResults,
    createKeyResult,
    updateKeyResult,
    deleteKeyResult,
    updateKeyResultValue,
    getKeyResultHistory,
};
