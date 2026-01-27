const workAnalyticsController = require('../controllers/workAnalyticsController');
const energyMappingController = require('../controllers/energyMappingController');
const contextSwitchingController = require('../controllers/contextSwitchingController');

async function workAnalyticsRoutes(fastify, options) {
    // ==================== WORK STRAIN ====================
    // Get work strain data
    fastify.get('/users/:userId/work/strain', workAnalyticsController.getWorkStrain);

    // ==================== WORK RECOVERY ====================
    // Get work recovery data
    fastify.get('/users/:userId/work/recovery', workAnalyticsController.getWorkRecovery);

    // ==================== WORK-LIFE BALANCE ====================
    // Get work-life balance data
    fastify.get('/users/:userId/work/work-life-balance', workAnalyticsController.getWorkLifeBalance);

    // ==================== ENERGY MAPPING ====================
    // Get energy mapping analysis
    fastify.get('/users/:userId/work/energy-mapping', energyMappingController.getEnergyMapping);

    // Log energy level
    fastify.post('/users/:userId/work/energy-logs', energyMappingController.createEnergyLog);

    // Get energy logs
    fastify.get('/users/:userId/work/energy-logs', energyMappingController.getEnergyLogs);

    // ==================== CONTEXT SWITCHING ====================
    // Get context switching data for a day
    fastify.get('/users/:userId/work/context-switching', contextSwitchingController.getContextSwitching);

    // Get context switching history
    fastify.get('/users/:userId/work/context-switching/history', contextSwitchingController.getContextSwitchingHistory);
}

module.exports = workAnalyticsRoutes;
