const studyController = require('../controllers/studyController');
const { study, common } = require('../schemas');

async function studyRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== LIBRARY SHELVES ====================
    fastify.get('/users/:userId/library', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get library shelves for a user',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getLibraryShelves);

    fastify.post('/users/:userId/library', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Add item to library',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createLibraryShelfBody
        }
    }, studyController.createLibraryShelf);

    fastify.put('/library/:id', {
        schema: {
            description: 'Update library item',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateLibraryShelfBody
        }
    }, studyController.updateLibraryShelf);

    fastify.delete('/library/:id', {
        schema: {
            description: 'Delete library item',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteLibraryShelf);

    // ==================== STUDY SESSIONS ====================
    fastify.get('/users/:userId/study-sessions', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get study sessions for a user',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getStudySessions);

    fastify.post('/users/:userId/study-sessions', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a study session',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createStudySessionBody
        }
    }, studyController.createStudySession);

    fastify.put('/study-sessions/:id', {
        schema: {
            description: 'Update a study session',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateStudySessionBody
        }
    }, studyController.updateStudySession);

    fastify.delete('/study-sessions/:id', {
        schema: {
            description: 'Delete a study session',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteStudySession);

    // ==================== SPACED REVIEWS ====================
    fastify.get('/users/:userId/reviews', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get spaced reviews for a user',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getSpacedReviews);

    fastify.get('/users/:userId/reviews/due', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get due reviews for a user',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getDueReviews);

    fastify.post('/users/:userId/reviews', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a spaced review',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createSpacedReviewBody
        }
    }, studyController.createSpacedReview);

    fastify.put('/reviews/:id', {
        schema: {
            description: 'Update a spaced review',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateSpacedReviewBody
        }
    }, studyController.updateSpacedReview);

    fastify.delete('/reviews/:id', {
        schema: {
            description: 'Delete a spaced review',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteSpacedReview);

    // ==================== NOTES ====================
    fastify.get('/users/:userId/notes', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get notes for a user',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getNotes);

    fastify.post('/users/:userId/notes', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a note',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createNoteBody
        }
    }, studyController.createNote);

    fastify.put('/notes/:id', {
        schema: {
            description: 'Update a note',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateNoteBody
        }
    }, studyController.updateNote);

    fastify.delete('/notes/:id', {
        schema: {
            description: 'Delete a note',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteNote);
}

module.exports = studyRoutes;
