const { WorkMode, WorkModeSession, WorkProject, WorkTask, User } = require('../models');
const { Op } = require('sequelize');

// Get all work modes for a user
const getWorkModes = async (request, reply) => {
    try {
        const { userId } = request.params;

        const modes = await WorkMode.findAll({
            where: { userId },
            order: [['isDefault', 'DESC'], ['name', 'ASC']],
        });

        return { success: true, data: modes };
    } catch (error) {
        console.error('Error fetching work modes:', error);
        return reply.status(500).send({ success: false, error: 'Failed to fetch work modes' });
    }
};

// Get a single work mode
const getWorkMode = async (request, reply) => {
    try {
        const { id } = request.params;

        const mode = await WorkMode.findByPk(id);

        if (!mode) {
            return reply.status(404).send({ success: false, error: 'Work mode not found' });
        }

        return { success: true, data: mode };
    } catch (error) {
        console.error('Error fetching work mode:', error);
        return reply.status(500).send({ success: false, error: 'Failed to fetch work mode' });
    }
};

// Create a new work mode
const createWorkMode = async (request, reply) => {
    try {
        const { userId } = request.params;
        const data = request.body;

        const mode = await WorkMode.create({
            ...data,
            userId,
        });

        return reply.status(201).send({ success: true, data: mode });
    } catch (error) {
        console.error('Error creating work mode:', error);
        return reply.status(500).send({ success: false, error: 'Failed to create work mode' });
    }
};

// Update a work mode
const updateWorkMode = async (request, reply) => {
    try {
        const { id } = request.params;
        const data = request.body;

        const mode = await WorkMode.findByPk(id);

        if (!mode) {
            return reply.status(404).send({ success: false, error: 'Work mode not found' });
        }

        // Cannot update system modes
        if (mode.isSystem) {
            return reply.status(400).send({ success: false, error: 'Cannot update system modes' });
        }

        await mode.update(data);

        return { success: true, data: mode };
    } catch (error) {
        console.error('Error updating work mode:', error);
        return reply.status(500).send({ success: false, error: 'Failed to update work mode' });
    }
};

// Delete a work mode
const deleteWorkMode = async (request, reply) => {
    try {
        const { id } = request.params;

        const mode = await WorkMode.findByPk(id);

        if (!mode) {
            return reply.status(404).send({ success: false, error: 'Work mode not found' });
        }

        // Cannot delete system modes
        if (mode.isSystem) {
            return reply.status(400).send({ success: false, error: 'Cannot delete system modes' });
        }

        await mode.destroy();

        return reply.status(204).send();
    } catch (error) {
        console.error('Error deleting work mode:', error);
        return reply.status(500).send({ success: false, error: 'Failed to delete work mode' });
    }
};

// Initialize default modes for a user
const initializeDefaultModes = async (request, reply) => {
    try {
        const { userId } = request.params;

        // Check if user already has modes
        const existingModes = await WorkMode.count({ where: { userId } });

        if (existingModes > 0) {
            return reply.status(400).send({ success: false, error: 'User already has work modes' });
        }

        // Create default modes
        const defaultModes = WorkMode.DEFAULT_MODES.map((mode, index) => ({
            ...mode,
            userId,
            isSystem: true,
            isDefault: index === 0, // First mode is default
        }));

        const modes = await WorkMode.bulkCreate(defaultModes);

        return reply.status(201).send({ success: true, data: modes });
    } catch (error) {
        console.error('Error initializing default modes:', error);
        return reply.status(500).send({ success: false, error: 'Failed to initialize default modes' });
    }
};

// Start a work mode session
const startSession = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { modeId, projectId, taskId, plannedDuration } = request.body;

        // Check for existing active session
        const activeSession = await WorkModeSession.findOne({
            where: {
                userId,
                status: { [Op.in]: ['in_progress', 'paused'] },
            },
        });

        if (activeSession) {
            return reply.status(400).send({ success: false, error: 'An active session already exists' });
        }

        const mode = await WorkMode.findByPk(modeId);
        if (!mode) {
            return reply.status(404).send({ success: false, error: 'Work mode not found' });
        }

        const session = await WorkModeSession.create({
            userId,
            modeId,
            projectId: projectId || null,
            taskId: taskId || null,
            plannedDuration: plannedDuration || mode.suggestedDuration,
            status: 'in_progress',
            startedAt: new Date(),
        });

        const fullSession = await WorkModeSession.findByPk(session.id, {
            include: [
                { model: WorkMode, as: 'mode' },
                { model: WorkProject, as: 'project' },
                { model: WorkTask, as: 'task' },
            ],
        });

        return reply.status(201).send({ success: true, data: fullSession });
    } catch (error) {
        console.error('Error starting session:', error);
        return reply.status(500).send({ success: false, error: 'Failed to start session' });
    }
};

// Pause a session
const pauseSession = async (request, reply) => {
    try {
        const { sessionId } = request.params;

        const session = await WorkModeSession.findByPk(sessionId);

        if (!session) {
            return reply.status(404).send({ success: false, error: 'Session not found' });
        }

        if (session.status !== 'in_progress') {
            return reply.status(400).send({ success: false, error: 'Session is not in progress' });
        }

        await session.update({
            status: 'paused',
            pausedAt: new Date(),
        });

        return { success: true, data: session };
    } catch (error) {
        console.error('Error pausing session:', error);
        return reply.status(500).send({ success: false, error: 'Failed to pause session' });
    }
};

// Resume a session
const resumeSession = async (request, reply) => {
    try {
        const { sessionId } = request.params;

        const session = await WorkModeSession.findByPk(sessionId);

        if (!session) {
            return reply.status(404).send({ success: false, error: 'Session not found' });
        }

        if (session.status !== 'paused') {
            return reply.status(400).send({ success: false, error: 'Session is not paused' });
        }

        // Calculate paused duration
        const pausedSeconds = Math.floor((new Date() - new Date(session.pausedAt)) / 1000);

        await session.update({
            status: 'in_progress',
            pausedAt: null,
            pausedDuration: session.pausedDuration + pausedSeconds,
        });

        return { success: true, data: session };
    } catch (error) {
        console.error('Error resuming session:', error);
        return reply.status(500).send({ success: false, error: 'Failed to resume session' });
    }
};

// Finish a session
const finishSession = async (request, reply) => {
    try {
        const { sessionId } = request.params;
        const { notes, blocksCompleted } = request.body;

        const session = await WorkModeSession.findByPk(sessionId);

        if (!session) {
            return reply.status(404).send({ success: false, error: 'Session not found' });
        }

        if (session.status === 'completed' || session.status === 'cancelled') {
            return reply.status(400).send({ success: false, error: 'Session already finished' });
        }

        const finishedAt = new Date();
        let actualDuration = Math.floor((finishedAt - new Date(session.startedAt)) / 1000);

        // If paused, add the current pause time
        if (session.status === 'paused' && session.pausedAt) {
            const currentPause = Math.floor((finishedAt - new Date(session.pausedAt)) / 1000);
            actualDuration -= (session.pausedDuration + currentPause);
        } else {
            actualDuration -= session.pausedDuration;
        }

        await session.update({
            status: 'completed',
            finishedAt,
            actualDuration,
            notes: notes || session.notes,
            blocksCompleted: blocksCompleted || session.blocksCompleted + 1,
        });

        const fullSession = await WorkModeSession.findByPk(session.id, {
            include: [
                { model: WorkMode, as: 'mode' },
                { model: WorkProject, as: 'project' },
                { model: WorkTask, as: 'task' },
            ],
        });

        return { success: true, data: fullSession };
    } catch (error) {
        console.error('Error finishing session:', error);
        return reply.status(500).send({ success: false, error: 'Failed to finish session' });
    }
};

// Cancel a session
const cancelSession = async (request, reply) => {
    try {
        const { sessionId } = request.params;

        const session = await WorkModeSession.findByPk(sessionId);

        if (!session) {
            return reply.status(404).send({ success: false, error: 'Session not found' });
        }

        if (session.status === 'completed' || session.status === 'cancelled') {
            return reply.status(400).send({ success: false, error: 'Session already finished' });
        }

        const finishedAt = new Date();
        let actualDuration = Math.floor((finishedAt - new Date(session.startedAt)) / 1000);
        actualDuration -= session.pausedDuration;

        await session.update({
            status: 'cancelled',
            finishedAt,
            actualDuration,
        });

        return { success: true, data: session };
    } catch (error) {
        console.error('Error cancelling session:', error);
        return reply.status(500).send({ success: false, error: 'Failed to cancel session' });
    }
};

// Get active session for a user
const getActiveSession = async (request, reply) => {
    try {
        const { userId } = request.params;

        const session = await WorkModeSession.findOne({
            where: {
                userId,
                status: { [Op.in]: ['in_progress', 'paused'] },
            },
            include: [
                { model: WorkMode, as: 'mode' },
                { model: WorkProject, as: 'project' },
                { model: WorkTask, as: 'task' },
            ],
        });

        return { success: true, data: session || null };
    } catch (error) {
        console.error('Error fetching active session:', error);
        return reply.status(500).send({ success: false, error: 'Failed to fetch active session' });
    }
};

// Get session history
const getSessionHistory = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { startDate, endDate, modeId, limit = 50 } = request.query;

        const where = { userId, status: 'completed' };

        if (startDate && endDate) {
            where.startedAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        if (modeId) {
            where.modeId = modeId;
        }

        const sessions = await WorkModeSession.findAll({
            where,
            include: [
                { model: WorkMode, as: 'mode' },
                { model: WorkProject, as: 'project' },
                { model: WorkTask, as: 'task' },
            ],
            order: [['startedAt', 'DESC']],
            limit: parseInt(limit),
        });

        return { success: true, data: sessions };
    } catch (error) {
        console.error('Error fetching session history:', error);
        return reply.status(500).send({ success: false, error: 'Failed to fetch session history' });
    }
};

// Get session statistics
const getSessionStats = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { startDate, endDate } = request.query;

        const where = { userId, status: 'completed' };

        if (startDate && endDate) {
            where.startedAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        const sessions = await WorkModeSession.findAll({
            where,
            include: [{ model: WorkMode, as: 'mode' }],
        });

        // Calculate statistics
        const totalSessions = sessions.length;
        const totalDuration = sessions.reduce((acc, s) => acc + (s.actualDuration || 0), 0);
        const totalBlocks = sessions.reduce((acc, s) => acc + s.blocksCompleted, 0);

        // Group by mode
        const byMode = {};
        sessions.forEach(session => {
            const modeName = session.mode?.name || 'Unknown';
            if (!byMode[modeName]) {
                byMode[modeName] = {
                    sessions: 0,
                    duration: 0,
                    blocks: 0,
                };
            }
            byMode[modeName].sessions += 1;
            byMode[modeName].duration += session.actualDuration || 0;
            byMode[modeName].blocks += session.blocksCompleted;
        });

        return {
            success: true,
            data: {
                totalSessions,
                totalDuration,
                totalBlocks,
                averageDuration: totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
                byMode,
            },
        };
    } catch (error) {
        console.error('Error fetching session stats:', error);
        return reply.status(500).send({ success: false, error: 'Failed to fetch session stats' });
    }
};

module.exports = {
    getWorkModes,
    getWorkMode,
    createWorkMode,
    updateWorkMode,
    deleteWorkMode,
    initializeDefaultModes,
    startSession,
    pauseSession,
    resumeSession,
    finishSession,
    cancelSession,
    getActiveSession,
    getSessionHistory,
    getSessionStats,
};
