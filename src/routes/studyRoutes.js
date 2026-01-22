const studyController = require('../controllers/studyController');

async function studyRoutes(fastify, options) {
    // ==================== LIBRARY SHELVES ====================
    fastify.get('/users/:userId/library', studyController.getLibraryShelves);
    fastify.post('/users/:userId/library', studyController.createLibraryShelf);
    fastify.put('/library/:id', studyController.updateLibraryShelf);
    fastify.delete('/library/:id', studyController.deleteLibraryShelf);

    // ==================== STUDY SESSIONS ====================
    fastify.get('/users/:userId/study-sessions', studyController.getStudySessions);
    fastify.post('/users/:userId/study-sessions', studyController.createStudySession);
    fastify.put('/study-sessions/:id', studyController.updateStudySession);
    fastify.delete('/study-sessions/:id', studyController.deleteStudySession);

    // ==================== SPACED REVIEWS ====================
    fastify.get('/users/:userId/reviews', studyController.getSpacedReviews);
    fastify.get('/users/:userId/reviews/due', studyController.getDueReviews);
    fastify.post('/users/:userId/reviews', studyController.createSpacedReview);
    fastify.put('/reviews/:id', studyController.updateSpacedReview);
    fastify.delete('/reviews/:id', studyController.deleteSpacedReview);

    // ==================== NOTES ====================
    fastify.get('/users/:userId/notes', studyController.getNotes);
    fastify.post('/users/:userId/notes', studyController.createNote);
    fastify.put('/notes/:id', studyController.updateNote);
    fastify.delete('/notes/:id', studyController.deleteNote);
}

module.exports = studyRoutes;
