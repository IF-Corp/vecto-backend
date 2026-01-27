const workModeController = require('../controllers/workModeController');

async function workModeRoutes(fastify, options) {
    // Work Modes CRUD
    fastify.get('/users/:userId/work-modes', workModeController.getWorkModes);
    fastify.get('/work-modes/:id', workModeController.getWorkMode);
    fastify.post('/users/:userId/work-modes', workModeController.createWorkMode);
    fastify.put('/work-modes/:id', workModeController.updateWorkMode);
    fastify.delete('/work-modes/:id', workModeController.deleteWorkMode);

    // Initialize default modes for a user
    fastify.post('/users/:userId/work-modes/initialize', workModeController.initializeDefaultModes);

    // Sessions
    fastify.post('/users/:userId/work-mode-sessions/start', workModeController.startSession);
    fastify.put('/work-mode-sessions/:sessionId/pause', workModeController.pauseSession);
    fastify.put('/work-mode-sessions/:sessionId/resume', workModeController.resumeSession);
    fastify.put('/work-mode-sessions/:sessionId/finish', workModeController.finishSession);
    fastify.put('/work-mode-sessions/:sessionId/cancel', workModeController.cancelSession);

    // Active session
    fastify.get('/users/:userId/work-mode-sessions/active', workModeController.getActiveSession);

    // Session history and stats
    fastify.get('/users/:userId/work-mode-sessions', workModeController.getSessionHistory);
    fastify.get('/users/:userId/work-mode-sessions/stats', workModeController.getSessionStats);
}

module.exports = workModeRoutes;
