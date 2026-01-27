const meetingController = require('../controllers/meetingController');
const { common } = require('../schemas');

async function meetingRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== MEETINGS ====================
    fastify.get('/users/:userId/work/meetings', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all meetings for a user',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, meetingController.getMeetings);

    fastify.get('/work/meetings/:id', {
        schema: {
            description: 'Get a specific meeting',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, meetingController.getMeeting);

    fastify.post('/users/:userId/work/meetings', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a meeting',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, meetingController.createMeeting);

    fastify.put('/work/meetings/:id', {
        schema: {
            description: 'Update a meeting',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, meetingController.updateMeeting);

    fastify.delete('/work/meetings/:id', {
        schema: {
            description: 'Delete a meeting',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, meetingController.deleteMeeting);

    // ==================== MEETING NOTES ====================
    fastify.post('/work/meetings/:meetingId/notes', {
        schema: {
            description: 'Add a note to a meeting',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
        },
    }, meetingController.addMeetingNote);

    fastify.put('/work/meeting-notes/:id', {
        schema: {
            description: 'Update a meeting note',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, meetingController.updateMeetingNote);

    fastify.delete('/work/meeting-notes/:id', {
        schema: {
            description: 'Delete a meeting note',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, meetingController.deleteMeetingNote);

    // ==================== MEETING ACTIONS ====================
    fastify.get('/work/meetings/:meetingId/actions', {
        schema: {
            description: 'Get actions for a meeting',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
        },
    }, meetingController.getMeetingActions);

    fastify.post('/work/meetings/:meetingId/actions', {
        schema: {
            description: 'Add an action to a meeting',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
        },
    }, meetingController.addMeetingAction);

    fastify.put('/work/meeting-actions/:id', {
        schema: {
            description: 'Update a meeting action',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, meetingController.updateMeetingAction);

    fastify.delete('/work/meeting-actions/:id', {
        schema: {
            description: 'Delete a meeting action',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, meetingController.deleteMeetingAction);

    fastify.post('/work/meeting-actions/:id/convert-to-task', {
        schema: {
            description: 'Convert a meeting action to a work task',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, meetingController.convertActionToTask);

    // ==================== MEETING ANALYSIS ====================
    fastify.get('/users/:userId/work/meetings/analysis', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get meeting load analysis',
            tags: ['Work - Meetings'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, meetingController.getMeetingAnalysis);
}

module.exports = meetingRoutes;
