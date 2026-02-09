const { FreezeModeConfig, FreezePeriod, FreezeModule, FreezeOptions, UserModule } = require('../models');
const { Op } = require('sequelize');
const { processScheduledFreezePeriods } = require('../jobs/freezeScheduler');

// ==================== LEGACY CONFIG (backward compatibility) ====================

const getFreezeModeConfig = async (request, reply) => {
    try {
        const { userId } = request.params;
        let config = await FreezeModeConfig.findOne({
            where: { user_id: userId }
        });

        if (!config) {
            config = await FreezeModeConfig.create({
                user_id: userId,
                is_active: false
            });
        }

        return { success: true, data: config };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateFreezeModeConfig = async (request, reply) => {
    try {
        const { userId } = request.params;
        let config = await FreezeModeConfig.findOne({
            where: { user_id: userId }
        });

        if (!config) {
            config = await FreezeModeConfig.create({
                ...request.body,
                user_id: userId
            });
            reply.status(201);
            return { success: true, data: config, created: true };
        }

        await config.update(request.body);
        return { success: true, data: config };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== FREEZE PERIODS ====================

const getFreezePeriods = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { status, limit = 20, offset = 0 } = request.query;

        const where = { user_id: userId };
        if (status) {
            where.status = status;
        }

        const periods = await FreezePeriod.findAndCountAll({
            where,
            include: [
                { model: FreezeModule, as: 'modules' },
                { model: FreezeOptions, as: 'options' }
            ],
            order: [['start_date', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return {
            success: true,
            data: periods.rows,
            total: periods.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getFreezePeriod = async (request, reply) => {
    try {
        const { id } = request.params;

        const period = await FreezePeriod.findByPk(id, {
            include: [
                { model: FreezeModule, as: 'modules' },
                { model: FreezeOptions, as: 'options' }
            ]
        });

        if (!period) {
            reply.status(404);
            return { success: false, error: 'Freeze period not found' };
        }

        return { success: true, data: period };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getActiveFreeze = async (request, reply) => {
    try {
        const { userId } = request.params;

        const activePeriod = await FreezePeriod.findOne({
            where: {
                user_id: userId,
                status: 'ACTIVE'
            },
            include: [
                { model: FreezeModule, as: 'modules' },
                { model: FreezeOptions, as: 'options' }
            ]
        });

        return { success: true, data: activePeriod };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createFreezePeriod = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { start_date, end_date, reason, reason_custom, modules, options, activate_immediately } = request.body;

        // Check for overlapping periods
        const existingActive = await FreezePeriod.findOne({
            where: {
                user_id: userId,
                status: { [Op.in]: ['SCHEDULED', 'ACTIVE'] },
                [Op.or]: [
                    {
                        start_date: { [Op.lte]: end_date },
                        end_date: { [Op.gte]: start_date }
                    }
                ]
            }
        });

        if (existingActive) {
            reply.status(400);
            return { success: false, error: 'There is already an active or scheduled freeze period overlapping with these dates' };
        }

        // Determine initial status
        const today = new Date().toISOString().split('T')[0];
        let status = 'SCHEDULED';
        let activated_at = null;

        if (activate_immediately || start_date <= today) {
            status = 'ACTIVE';
            activated_at = new Date();
        }

        // Create freeze period
        const period = await FreezePeriod.create({
            user_id: userId,
            start_date,
            end_date,
            reason,
            reason_custom,
            status,
            activated_at
        });

        // Create freeze modules
        if (modules && modules.length > 0) {
            const moduleRecords = modules.map(moduleType => ({
                freeze_period_id: period.id,
                module_type: moduleType
            }));
            await FreezeModule.bulkCreate(moduleRecords);
        }

        // Create freeze options with defaults
        await FreezeOptions.create({
            freeze_period_id: period.id,
            freeze_streaks: options?.freeze_streaks ?? true,
            hide_non_essential_tasks: options?.hide_non_essential_tasks ?? true,
            pause_general_notifications: options?.pause_general_notifications ?? true,
            pause_goals: options?.pause_goals ?? true,
            keep_important_events: options?.keep_important_events ?? true
        });

        // Update legacy config if activated
        if (status === 'ACTIVE') {
            await syncLegacyConfig(userId, true, start_date, end_date, reason);
        }

        // Reload with associations
        const result = await FreezePeriod.findByPk(period.id, {
            include: [
                { model: FreezeModule, as: 'modules' },
                { model: FreezeOptions, as: 'options' }
            ]
        });

        reply.status(201);
        return { success: true, data: result };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateFreezePeriod = async (request, reply) => {
    try {
        const { id } = request.params;
        const { start_date, end_date, reason, reason_custom, modules, options } = request.body;

        const period = await FreezePeriod.findByPk(id);

        if (!period) {
            reply.status(404);
            return { success: false, error: 'Freeze period not found' };
        }

        // Cannot edit completed or cancelled periods
        if (['COMPLETED', 'CANCELLED'].includes(period.status)) {
            reply.status(400);
            return { success: false, error: 'Cannot edit completed or cancelled freeze periods' };
        }

        // Update period
        await period.update({
            start_date: start_date || period.start_date,
            end_date: end_date || period.end_date,
            reason: reason !== undefined ? reason : period.reason,
            reason_custom: reason_custom !== undefined ? reason_custom : period.reason_custom
        });

        // Update modules if provided
        if (modules !== undefined) {
            await FreezeModule.destroy({ where: { freeze_period_id: id } });
            if (modules.length > 0) {
                const moduleRecords = modules.map(moduleType => ({
                    freeze_period_id: id,
                    module_type: moduleType
                }));
                await FreezeModule.bulkCreate(moduleRecords);
            }
        }

        // Update options if provided
        if (options) {
            await FreezeOptions.update(options, {
                where: { freeze_period_id: id }
            });
        }

        // Reload with associations
        const result = await FreezePeriod.findByPk(id, {
            include: [
                { model: FreezeModule, as: 'modules' },
                { model: FreezeOptions, as: 'options' }
            ]
        });

        return { success: true, data: result };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const activateFreezeMode = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { end_date, reason } = request.body;

        // Check for existing active period
        const existingActive = await FreezePeriod.findOne({
            where: {
                user_id: userId,
                status: 'ACTIVE'
            }
        });

        if (existingActive) {
            reply.status(400);
            return { success: false, error: 'There is already an active freeze period' };
        }

        // Create new active period
        const today = new Date().toISOString().split('T')[0];
        const period = await FreezePeriod.create({
            user_id: userId,
            start_date: today,
            end_date,
            reason,
            status: 'ACTIVE',
            activated_at: new Date()
        });

        // Create default options
        await FreezeOptions.create({
            freeze_period_id: period.id
        });

        // Get user's active modules and freeze all
        const userModules = await UserModule.findAll({
            where: { user_id: userId, is_active: true }
        });

        if (userModules.length > 0) {
            const moduleRecords = userModules.map(m => ({
                freeze_period_id: period.id,
                module_type: m.module_type
            }));
            await FreezeModule.bulkCreate(moduleRecords);
        }

        // Update legacy config
        await syncLegacyConfig(userId, true, today, end_date, reason);

        // Clear freeze guard cache
        if (request.server.clearFreezeCache) request.server.clearFreezeCache(userId);

        const result = await FreezePeriod.findByPk(period.id, {
            include: [
                { model: FreezeModule, as: 'modules' },
                { model: FreezeOptions, as: 'options' }
            ]
        });

        return { success: true, data: result };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const activateFreezePeriod = async (request, reply) => {
    try {
        const { id } = request.params;

        const period = await FreezePeriod.findByPk(id);

        if (!period) {
            reply.status(404);
            return { success: false, error: 'Freeze period not found' };
        }

        if (period.status !== 'SCHEDULED') {
            reply.status(400);
            return { success: false, error: 'Only scheduled periods can be activated' };
        }

        // Check for other active periods
        const existingActive = await FreezePeriod.findOne({
            where: {
                user_id: period.user_id,
                status: 'ACTIVE',
                id: { [Op.ne]: id }
            }
        });

        if (existingActive) {
            reply.status(400);
            return { success: false, error: 'There is already an active freeze period' };
        }

        await period.update({
            status: 'ACTIVE',
            activated_at: new Date()
        });

        // Update legacy config
        await syncLegacyConfig(period.user_id, true, period.start_date, period.end_date, period.reason);

        // Clear freeze guard cache
        if (request.server.clearFreezeCache) request.server.clearFreezeCache(period.user_id);

        const result = await FreezePeriod.findByPk(id, {
            include: [
                { model: FreezeModule, as: 'modules' },
                { model: FreezeOptions, as: 'options' }
            ]
        });

        return { success: true, data: result };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deactivateFreezeMode = async (request, reply) => {
    try {
        const { userId } = request.params;

        const period = await FreezePeriod.findOne({
            where: {
                user_id: userId,
                status: 'ACTIVE'
            }
        });

        if (!period) {
            reply.status(404);
            return { success: false, error: 'No active freeze period found' };
        }

        await period.update({
            status: 'COMPLETED',
            deactivated_at: new Date()
        });

        // Update legacy config
        await syncLegacyConfig(userId, false, null, null, null);

        // Clear freeze guard cache
        if (request.server.clearFreezeCache) request.server.clearFreezeCache(userId);

        const result = await FreezePeriod.findByPk(period.id, {
            include: [
                { model: FreezeModule, as: 'modules' },
                { model: FreezeOptions, as: 'options' }
            ]
        });

        return { success: true, data: result };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const cancelFreezePeriod = async (request, reply) => {
    try {
        const { id } = request.params;

        const period = await FreezePeriod.findByPk(id);

        if (!period) {
            reply.status(404);
            return { success: false, error: 'Freeze period not found' };
        }

        if (!['SCHEDULED', 'ACTIVE'].includes(period.status)) {
            reply.status(400);
            return { success: false, error: 'Only scheduled or active periods can be cancelled' };
        }

        const wasActive = period.status === 'ACTIVE';

        await period.update({
            status: 'CANCELLED',
            deactivated_at: new Date()
        });

        // Update legacy config if was active
        if (wasActive) {
            await syncLegacyConfig(period.user_id, false, null, null, null);
        }

        // Clear freeze guard cache
        if (request.server.clearFreezeCache) request.server.clearFreezeCache(period.user_id);

        const result = await FreezePeriod.findByPk(id, {
            include: [
                { model: FreezeModule, as: 'modules' },
                { model: FreezeOptions, as: 'options' }
            ]
        });

        return { success: true, data: result };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteFreezePeriod = async (request, reply) => {
    try {
        const { id } = request.params;

        const period = await FreezePeriod.findByPk(id);

        if (!period) {
            reply.status(404);
            return { success: false, error: 'Freeze period not found' };
        }

        if (period.status === 'ACTIVE') {
            reply.status(400);
            return { success: false, error: 'Cannot delete an active freeze period. Deactivate it first.' };
        }

        await period.destroy();

        return { success: true, message: 'Freeze period deleted' };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== FREEZE STATISTICS ====================

const getFreezeStatistics = async (request, reply) => {
    try {
        const { userId } = request.params;

        const totalPeriods = await FreezePeriod.count({
            where: { user_id: userId }
        });

        const completedPeriods = await FreezePeriod.count({
            where: { user_id: userId, status: 'COMPLETED' }
        });

        const activePeriod = await FreezePeriod.findOne({
            where: { user_id: userId, status: 'ACTIVE' },
            include: [{ model: FreezeOptions, as: 'options' }]
        });

        const scheduledPeriods = await FreezePeriod.count({
            where: { user_id: userId, status: 'SCHEDULED' }
        });

        // Calculate total frozen days
        const allPeriods = await FreezePeriod.findAll({
            where: {
                user_id: userId,
                status: { [Op.in]: ['ACTIVE', 'COMPLETED'] }
            }
        });

        let totalFrozenDays = 0;
        allPeriods.forEach(p => {
            const start = new Date(p.start_date);
            const end = p.deactivated_at ? new Date(p.deactivated_at) : new Date(p.end_date);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            totalFrozenDays += days;
        });

        return {
            success: true,
            data: {
                total_periods: totalPeriods,
                completed_periods: completedPeriods,
                scheduled_periods: scheduledPeriods,
                total_frozen_days: totalFrozenDays,
                is_frozen: !!activePeriod,
                active_period: activePeriod
            }
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== HELPER FUNCTIONS ====================

// ==================== SCHEDULER ENDPOINT ====================

const triggerScheduledProcessing = async (request, reply) => {
    try {
        // Optional: Add API key validation for external cron services
        const apiKey = request.headers['x-api-key'];
        const expectedKey = process.env.SCHEDULER_API_KEY;

        if (expectedKey && apiKey !== expectedKey) {
            reply.status(401);
            return { success: false, error: 'Invalid API key' };
        }

        const results = await processScheduledFreezePeriods();

        return {
            success: true,
            data: {
                activated: results.activated,
                completed: results.completed,
                errors: results.activationErrors.length + results.completionErrors.length,
                duration_ms: results.duration
            }
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== HELPER FUNCTIONS ====================

async function syncLegacyConfig(userId, isActive, startDate, endDate, reason) {
    try {
        let config = await FreezeModeConfig.findOne({
            where: { user_id: userId }
        });

        if (!config) {
            config = await FreezeModeConfig.create({
                user_id: userId,
                is_active: isActive,
                start_date: startDate ? new Date(startDate) : null,
                end_date: endDate ? new Date(endDate) : null,
                reason
            });
        } else {
            await config.update({
                is_active: isActive,
                start_date: startDate ? new Date(startDate) : null,
                end_date: endDate ? new Date(endDate) : null,
                reason: isActive ? reason : null
            });
        }
    } catch (error) {
        console.error('Error syncing legacy freeze config:', error);
    }
}

module.exports = {
    // Legacy
    getFreezeModeConfig,
    updateFreezeModeConfig,
    // Freeze Periods
    getFreezePeriods,
    getFreezePeriod,
    getActiveFreeze,
    createFreezePeriod,
    updateFreezePeriod,
    activateFreezeMode,
    activateFreezePeriod,
    deactivateFreezeMode,
    cancelFreezePeriod,
    deleteFreezePeriod,
    // Statistics
    getFreezeStatistics,
    // Scheduler
    triggerScheduledProcessing
};
