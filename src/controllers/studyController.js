const { LibraryShelf, StudySession, SpacedReview, Note } = require('../models');

// ==================== LIBRARY SHELVES ====================

const getLibraryShelves = async (request, reply) => {
    try {
        const { userId } = request.params;
        const items = await LibraryShelf.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });
        return { success: true, data: items };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createLibraryShelf = async (request, reply) => {
    try {
        const { userId } = request.params;
        const item = await LibraryShelf.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: item, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateLibraryShelf = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await LibraryShelf.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Library item not found' };
        }
        const item = await LibraryShelf.findByPk(id);
        return { success: true, data: item };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteLibraryShelf = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await LibraryShelf.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Library item not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== STUDY SESSIONS ====================

const getStudySessions = async (request, reply) => {
    try {
        const { userId } = request.params;
        const sessions = await StudySession.findAll({
            where: { user_id: userId },
            order: [['start_time', 'DESC']]
        });
        return { success: true, data: sessions };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createStudySession = async (request, reply) => {
    try {
        const { userId } = request.params;
        const session = await StudySession.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: session, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateStudySession = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await StudySession.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Study session not found' };
        }
        const session = await StudySession.findByPk(id);
        return { success: true, data: session };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteStudySession = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudySession.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Study session not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== SPACED REVIEWS ====================

const getSpacedReviews = async (request, reply) => {
    try {
        const { userId } = request.params;
        const reviews = await SpacedReview.findAll({
            where: { user_id: userId },
            order: [['next_review_date', 'ASC']]
        });
        return { success: true, data: reviews };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getDueReviews = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { Op } = require('sequelize');
        const today = new Date().toISOString().split('T')[0];
        const reviews = await SpacedReview.findAll({
            where: {
                user_id: userId,
                next_review_date: { [Op.lte]: today }
            },
            order: [['next_review_date', 'ASC']]
        });
        return { success: true, data: reviews };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createSpacedReview = async (request, reply) => {
    try {
        const { userId } = request.params;
        const review = await SpacedReview.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: review, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateSpacedReview = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await SpacedReview.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Spaced review not found' };
        }
        const review = await SpacedReview.findByPk(id);
        return { success: true, data: review };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteSpacedReview = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await SpacedReview.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Spaced review not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== NOTES ====================

const getNotes = async (request, reply) => {
    try {
        const { userId } = request.params;
        const notes = await Note.findAll({
            where: { user_id: userId },
            order: [
                ['is_pinned', 'DESC'],
                ['updated_at', 'DESC']
            ]
        });
        return { success: true, data: notes };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createNote = async (request, reply) => {
    try {
        const { userId } = request.params;
        const note = await Note.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: note, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateNote = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await Note.update(request.body, {
            where: { id }
        });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Note not found' };
        }
        const note = await Note.findByPk(id);
        return { success: true, data: note };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteNote = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await Note.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Note not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    // Library Shelves
    getLibraryShelves,
    createLibraryShelf,
    updateLibraryShelf,
    deleteLibraryShelf,
    // Study Sessions
    getStudySessions,
    createStudySession,
    updateStudySession,
    deleteStudySession,
    // Spaced Reviews
    getSpacedReviews,
    getDueReviews,
    createSpacedReview,
    updateSpacedReview,
    deleteSpacedReview,
    // Notes
    getNotes,
    createNote,
    updateNote,
    deleteNote
};
