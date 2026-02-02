/**
 * Freeze Mode Scheduler
 *
 * Handles automatic activation and completion of freeze periods:
 * - Activates SCHEDULED periods when startDate <= today
 * - Completes ACTIVE periods when endDate < today
 */

const { FreezePeriod, FreezeModule, FreezeOptions, FreezeModeConfig } = require('../models');
const { Op } = require('sequelize');

/**
 * Sync legacy FreezeModeConfig for backward compatibility
 */
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

/**
 * Activate scheduled periods that should start today or earlier
 */
async function activateScheduledPeriods() {
    const today = new Date().toISOString().split('T')[0];
    const results = { activated: 0, errors: [] };

    try {
        // Find all scheduled periods that should be activated
        const periodsToActivate = await FreezePeriod.findAll({
            where: {
                status: 'SCHEDULED',
                start_date: { [Op.lte]: today }
            }
        });

        for (const period of periodsToActivate) {
            try {
                // Check if user already has an active period
                const existingActive = await FreezePeriod.findOne({
                    where: {
                        user_id: period.user_id,
                        status: 'ACTIVE',
                        id: { [Op.ne]: period.id }
                    }
                });

                if (existingActive) {
                    // Cannot activate - user already has active period
                    // Mark this one as cancelled to avoid conflicts
                    await period.update({
                        status: 'CANCELLED',
                        deactivated_at: new Date()
                    });
                    results.errors.push({
                        periodId: period.id,
                        userId: period.user_id,
                        error: 'User already has an active freeze period'
                    });
                    continue;
                }

                // Activate the period
                await period.update({
                    status: 'ACTIVE',
                    activated_at: new Date()
                });

                // Sync legacy config
                await syncLegacyConfig(
                    period.user_id,
                    true,
                    period.start_date,
                    period.end_date,
                    period.reason
                );

                results.activated++;
                console.log(`[FreezeScheduler] Activated period ${period.id} for user ${period.user_id}`);
            } catch (error) {
                results.errors.push({
                    periodId: period.id,
                    userId: period.user_id,
                    error: error.message
                });
                console.error(`[FreezeScheduler] Error activating period ${period.id}:`, error.message);
            }
        }
    } catch (error) {
        console.error('[FreezeScheduler] Error finding scheduled periods:', error);
        results.errors.push({ error: error.message });
    }

    return results;
}

/**
 * Complete active periods that have passed their end date
 */
async function completeExpiredPeriods() {
    const today = new Date().toISOString().split('T')[0];
    const results = { completed: 0, errors: [] };

    try {
        // Find all active periods that have expired
        const periodsToComplete = await FreezePeriod.findAll({
            where: {
                status: 'ACTIVE',
                end_date: { [Op.lt]: today }
            }
        });

        for (const period of periodsToComplete) {
            try {
                // Complete the period
                await period.update({
                    status: 'COMPLETED',
                    deactivated_at: new Date()
                });

                // Sync legacy config
                await syncLegacyConfig(period.user_id, false, null, null, null);

                results.completed++;
                console.log(`[FreezeScheduler] Completed period ${period.id} for user ${period.user_id}`);
            } catch (error) {
                results.errors.push({
                    periodId: period.id,
                    userId: period.user_id,
                    error: error.message
                });
                console.error(`[FreezeScheduler] Error completing period ${period.id}:`, error.message);
            }
        }
    } catch (error) {
        console.error('[FreezeScheduler] Error finding expired periods:', error);
        results.errors.push({ error: error.message });
    }

    return results;
}

/**
 * Run all scheduled tasks
 */
async function processScheduledFreezePeriods() {
    console.log('[FreezeScheduler] Starting scheduled freeze period processing...');
    const startTime = Date.now();

    const activationResults = await activateScheduledPeriods();
    const completionResults = await completeExpiredPeriods();

    const duration = Date.now() - startTime;
    console.log(`[FreezeScheduler] Completed in ${duration}ms:`, {
        activated: activationResults.activated,
        completed: completionResults.completed,
        errors: activationResults.errors.length + completionResults.errors.length
    });

    return {
        activated: activationResults.activated,
        activationErrors: activationResults.errors,
        completed: completionResults.completed,
        completionErrors: completionResults.errors,
        duration
    };
}

/**
 * Start the scheduler with interval (for running in-process)
 * @param {number} intervalMs - Interval in milliseconds (default: 1 hour)
 */
function startScheduler(intervalMs = 60 * 60 * 1000) {
    console.log(`[FreezeScheduler] Starting scheduler with interval ${intervalMs}ms`);

    // Run immediately on startup
    processScheduledFreezePeriods().catch(err => {
        console.error('[FreezeScheduler] Error on initial run:', err);
    });

    // Then run at interval
    const intervalId = setInterval(() => {
        processScheduledFreezePeriods().catch(err => {
            console.error('[FreezeScheduler] Error on scheduled run:', err);
        });
    }, intervalMs);

    return intervalId;
}

module.exports = {
    processScheduledFreezePeriods,
    activateScheduledPeriods,
    completeExpiredPeriods,
    startScheduler
};
