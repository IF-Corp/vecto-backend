const { Op } = require('sequelize');
const {
    LibraryShelf,
    StudySession,
    SpacedReview,
    Note,
    StudySettings,
    StudyCourse,
    StudyPeriod,
    StudySubject,
    StudySubjectWeight,
    StudyTopic,
    StudyEvaluation,
    StudyEvaluationTopic,
    StudyEvaluationFeedback,
    StudyBook,
    StudyCourseOnline,
    StudyProgressLog,
    StudyRetentionLog,
    StudyDeck,
    StudyFlashcard,
    StudyReviewSession,
    StudyReviewLog,
    StudyProjectTemplate,
    StudyProject,
    StudyProjectResource,
    StudyProjectMilestone,
    StudyFocusPreset,
    StudyFocusSession,
    StudyFocusBlock,
} = require('../models');

// ==================== STUDY SETTINGS ====================

const getStudySettings = async (request, reply) => {
    try {
        const { userId } = request.params;
        let settings = await StudySettings.findOne({ where: { user_id: userId } });
        if (!settings) {
            settings = await StudySettings.create({ user_id: userId });
        }
        return { success: true, data: settings };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateStudySettings = async (request, reply) => {
    try {
        const { userId } = request.params;
        let settings = await StudySettings.findOne({ where: { user_id: userId } });
        if (!settings) {
            settings = await StudySettings.create({ user_id: userId, ...request.body });
        } else {
            await settings.update(request.body);
        }
        return { success: true, data: settings };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== COURSES (Formal Education) ====================

const getCourses = async (request, reply) => {
    try {
        const { userId } = request.params;
        const courses = await StudyCourse.findAll({
            where: { user_id: userId },
            include: [{ model: StudyPeriod, as: 'periods' }],
            order: [['created_at', 'DESC']],
        });
        return { success: true, data: courses };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getCourse = async (request, reply) => {
    try {
        const { id } = request.params;
        const course = await StudyCourse.findByPk(id, {
            include: [
                {
                    model: StudyPeriod,
                    as: 'periods',
                    include: [{ model: StudySubject, as: 'subjects' }],
                },
            ],
        });
        if (!course) {
            reply.status(404);
            return { success: false, error: 'Course not found' };
        }
        return { success: true, data: course };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createCourse = async (request, reply) => {
    try {
        const { userId } = request.params;
        const course = await StudyCourse.create({ ...request.body, user_id: userId });
        reply.status(201);
        return { success: true, data: course, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateCourse = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await StudyCourse.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Course not found' };
        }
        const course = await StudyCourse.findByPk(id);
        return { success: true, data: course };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteCourse = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudyCourse.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Course not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== PERIODS ====================

const getPeriods = async (request, reply) => {
    try {
        const { courseId } = request.params;
        const periods = await StudyPeriod.findAll({
            where: { course_id: courseId },
            include: [{ model: StudySubject, as: 'subjects' }],
            order: [['number', 'ASC']],
        });
        return { success: true, data: periods };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createPeriod = async (request, reply) => {
    try {
        const { courseId } = request.params;
        const period = await StudyPeriod.create({ ...request.body, course_id: courseId });
        reply.status(201);
        return { success: true, data: period, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updatePeriod = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await StudyPeriod.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Period not found' };
        }
        const period = await StudyPeriod.findByPk(id);
        return { success: true, data: period };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deletePeriod = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudyPeriod.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Period not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== SUBJECTS ====================

const getSubjects = async (request, reply) => {
    try {
        const { periodId } = request.params;
        const subjects = await StudySubject.findAll({
            where: { period_id: periodId },
            include: [
                { model: StudySubjectWeight, as: 'weights' },
                { model: StudyEvaluation, as: 'evaluations' },
            ],
            order: [['name', 'ASC']],
        });
        return { success: true, data: subjects };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getSubject = async (request, reply) => {
    try {
        const { id } = request.params;
        const subject = await StudySubject.findByPk(id, {
            include: [
                { model: StudySubjectWeight, as: 'weights' },
                {
                    model: StudyEvaluation,
                    as: 'evaluations',
                    include: [{ model: StudyEvaluationFeedback, as: 'feedback' }],
                },
                { model: StudyPeriod, as: 'period', include: [{ model: StudyCourse, as: 'course' }] },
            ],
        });
        if (!subject) {
            reply.status(404);
            return { success: false, error: 'Subject not found' };
        }
        return { success: true, data: subject };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createSubject = async (request, reply) => {
    try {
        const { periodId } = request.params;
        const { weights, ...subjectData } = request.body;
        const subject = await StudySubject.create({ ...subjectData, period_id: periodId });

        if (weights && weights.length > 0) {
            await StudySubjectWeight.bulkCreate(
                weights.map((w) => ({ ...w, subject_id: subject.id }))
            );
        }

        const fullSubject = await StudySubject.findByPk(subject.id, {
            include: [{ model: StudySubjectWeight, as: 'weights' }],
        });
        reply.status(201);
        return { success: true, data: fullSubject, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateSubject = async (request, reply) => {
    try {
        const { id } = request.params;
        const { weights, ...subjectData } = request.body;

        const [updated] = await StudySubject.update(subjectData, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Subject not found' };
        }

        if (weights) {
            await StudySubjectWeight.destroy({ where: { subject_id: id } });
            if (weights.length > 0) {
                await StudySubjectWeight.bulkCreate(
                    weights.map((w) => ({ ...w, subject_id: id }))
                );
            }
        }

        const subject = await StudySubject.findByPk(id, {
            include: [{ model: StudySubjectWeight, as: 'weights' }],
        });
        return { success: true, data: subject };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteSubject = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudySubject.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Subject not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== EVALUATIONS ====================

const getEvaluations = async (request, reply) => {
    try {
        const { subjectId } = request.params;
        const evaluations = await StudyEvaluation.findAll({
            where: { subject_id: subjectId },
            include: [
                { model: StudyEvaluationFeedback, as: 'feedback' },
                { model: StudyTopic, as: 'topics' },
            ],
            order: [['date', 'ASC']],
        });
        return { success: true, data: evaluations };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createEvaluation = async (request, reply) => {
    try {
        const { subjectId } = request.params;
        const { topic_ids, ...evalData } = request.body;
        const evaluation = await StudyEvaluation.create({ ...evalData, subject_id: subjectId });

        if (topic_ids && topic_ids.length > 0) {
            await StudyEvaluationTopic.bulkCreate(
                topic_ids.map((topicId) => ({
                    evaluation_id: evaluation.id,
                    topic_id: topicId,
                }))
            );
        }

        reply.status(201);
        return { success: true, data: evaluation, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateEvaluation = async (request, reply) => {
    try {
        const { id } = request.params;
        const { topic_ids, ...evalData } = request.body;

        const [updated] = await StudyEvaluation.update(evalData, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Evaluation not found' };
        }

        if (topic_ids !== undefined) {
            await StudyEvaluationTopic.destroy({ where: { evaluation_id: id } });
            if (topic_ids.length > 0) {
                await StudyEvaluationTopic.bulkCreate(
                    topic_ids.map((topicId) => ({ evaluation_id: id, topic_id: topicId }))
                );
            }
        }

        const evaluation = await StudyEvaluation.findByPk(id, {
            include: [{ model: StudyTopic, as: 'topics' }],
        });
        return { success: true, data: evaluation };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteEvaluation = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudyEvaluation.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Evaluation not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createEvaluationFeedback = async (request, reply) => {
    try {
        const { evaluationId } = request.params;
        const existing = await StudyEvaluationFeedback.findOne({
            where: { evaluation_id: evaluationId },
        });
        if (existing) {
            await existing.update(request.body);
            return { success: true, data: existing };
        }
        const feedback = await StudyEvaluationFeedback.create({
            ...request.body,
            evaluation_id: evaluationId,
        });
        reply.status(201);
        return { success: true, data: feedback, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== TOPICS ====================

const getTopics = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { parent_type, parent_id } = request.query;
        const where = { user_id: userId };
        if (parent_type) where.parent_type = parent_type;
        if (parent_id) where.parent_id = parent_id;

        const topics = await StudyTopic.findAll({
            where,
            include: [{ model: StudyRetentionLog, as: 'retentionLogs', limit: 5, order: [['evaluated_at', 'DESC']] }],
            order: [['retention_rating', 'ASC NULLS FIRST'], ['name', 'ASC']],
        });
        return { success: true, data: topics };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createTopic = async (request, reply) => {
    try {
        const { userId } = request.params;
        const topic = await StudyTopic.create({ ...request.body, user_id: userId });
        reply.status(201);
        return { success: true, data: topic, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateTopic = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await StudyTopic.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Topic not found' };
        }
        const topic = await StudyTopic.findByPk(id);
        return { success: true, data: topic };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteTopic = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudyTopic.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Topic not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const logRetention = async (request, reply) => {
    try {
        const { topicId } = request.params;
        const { rating } = request.body;

        await StudyTopic.update(
            { retention_rating: rating, last_reviewed_at: new Date() },
            { where: { id: topicId } }
        );

        const log = await StudyRetentionLog.create({
            topic_id: topicId,
            rating,
        });
        reply.status(201);
        return { success: true, data: log, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== BOOKS ====================

const getBooks = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { status, project_id } = request.query;
        const where = { user_id: userId };
        if (status) where.status = status;
        if (project_id) where.project_id = project_id;

        const books = await StudyBook.findAll({
            where,
            include: [
                { model: StudySubject, as: 'subject' },
                { model: StudyProject, as: 'project' },
            ],
            order: [['updated_at', 'DESC']],
        });
        return { success: true, data: books };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createBook = async (request, reply) => {
    try {
        const { userId } = request.params;
        const book = await StudyBook.create({ ...request.body, user_id: userId });
        reply.status(201);
        return { success: true, data: book, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateBook = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await StudyBook.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Book not found' };
        }
        const book = await StudyBook.findByPk(id);
        return { success: true, data: book };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteBook = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudyBook.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Book not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== ONLINE COURSES ====================

const getCoursesOnline = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { status, category, project_id } = request.query;
        const where = { user_id: userId };
        if (status) where.status = status;
        if (category) where.category = category;
        if (project_id) where.project_id = project_id;

        const courses = await StudyCourseOnline.findAll({
            where,
            include: [{ model: StudyProject, as: 'project' }],
            order: [['updated_at', 'DESC']],
        });
        return { success: true, data: courses };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createCourseOnline = async (request, reply) => {
    try {
        const { userId } = request.params;
        const course = await StudyCourseOnline.create({ ...request.body, user_id: userId });
        reply.status(201);
        return { success: true, data: course, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateCourseOnline = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await StudyCourseOnline.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Online course not found' };
        }
        const course = await StudyCourseOnline.findByPk(id);
        return { success: true, data: course };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteCourseOnline = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudyCourseOnline.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Online course not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== PROGRESS LOGS ====================

const logProgress = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { resource_type, resource_id, progress_to } = request.body;

        // Get current progress
        let currentProgress = 0;
        if (resource_type === 'BOOK') {
            const book = await StudyBook.findByPk(resource_id);
            if (book) {
                currentProgress = book.current_page || 0;
                await book.update({
                    current_page: progress_to,
                    status: progress_to > 0 ? 'IN_PROGRESS' : book.status,
                    started_at: book.started_at || new Date(),
                });
            }
        } else if (resource_type === 'COURSE_ONLINE') {
            const course = await StudyCourseOnline.findByPk(resource_id);
            if (course) {
                currentProgress = course.current_lesson || 0;
                await course.update({
                    current_lesson: progress_to,
                    status: progress_to > 0 ? 'IN_PROGRESS' : course.status,
                    started_at: course.started_at || new Date(),
                });
            }
        }

        const log = await StudyProgressLog.create({
            ...request.body,
            user_id: userId,
            progress_from: currentProgress,
            date: request.body.date || new Date(),
        });
        reply.status(201);
        return { success: true, data: log, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getProgressLogs = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { resource_type, resource_id } = request.query;
        const where = { user_id: userId };
        if (resource_type) where.resource_type = resource_type;
        if (resource_id) where.resource_id = resource_id;

        const logs = await StudyProgressLog.findAll({
            where,
            order: [['date', 'DESC']],
            limit: 50,
        });
        return { success: true, data: logs };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== DECKS & FLASHCARDS ====================

const getDecks = async (request, reply) => {
    try {
        const { userId } = request.params;
        const decks = await StudyDeck.findAll({
            where: { user_id: userId },
            include: [
                { model: StudySubject, as: 'subject' },
                { model: StudyTopic, as: 'topic' },
            ],
            order: [['updated_at', 'DESC']],
        });
        return { success: true, data: decks };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createDeck = async (request, reply) => {
    try {
        const { userId } = request.params;
        const deck = await StudyDeck.create({ ...request.body, user_id: userId });
        reply.status(201);
        return { success: true, data: deck, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateDeck = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await StudyDeck.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Deck not found' };
        }
        const deck = await StudyDeck.findByPk(id);
        return { success: true, data: deck };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteDeck = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudyDeck.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Deck not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getFlashcards = async (request, reply) => {
    try {
        const { deckId } = request.params;
        const flashcards = await StudyFlashcard.findAll({
            where: { deck_id: deckId },
            order: [['created_at', 'DESC']],
        });
        return { success: true, data: flashcards };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createFlashcard = async (request, reply) => {
    try {
        const { deckId } = request.params;
        const flashcard = await StudyFlashcard.create({ ...request.body, deck_id: deckId });

        // Update deck card count
        await StudyDeck.increment('cards_count', { where: { id: deckId } });

        reply.status(201);
        return { success: true, data: flashcard, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateFlashcard = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await StudyFlashcard.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Flashcard not found' };
        }
        const flashcard = await StudyFlashcard.findByPk(id);
        return { success: true, data: flashcard };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteFlashcard = async (request, reply) => {
    try {
        const { id } = request.params;
        const flashcard = await StudyFlashcard.findByPk(id);
        if (!flashcard) {
            reply.status(404);
            return { success: false, error: 'Flashcard not found' };
        }

        const deckId = flashcard.deck_id;
        await flashcard.destroy();

        // Update deck card count
        await StudyDeck.decrement('cards_count', { where: { id: deckId } });

        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== REVIEW SESSIONS ====================

const getDueCards = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { deck_id } = request.query;

        const where = { next_review_at: { [Op.lte]: new Date() } };

        let deckWhere = {};
        if (deck_id) {
            where.deck_id = deck_id;
        } else {
            deckWhere = { user_id: userId };
        }

        const cards = await StudyFlashcard.findAll({
            where,
            include: [
                {
                    model: StudyDeck,
                    as: 'deck',
                    where: deckWhere,
                    required: true,
                },
            ],
            order: [['next_review_at', 'ASC']],
            limit: 50,
        });

        // Also get new cards
        const newCards = await StudyFlashcard.findAll({
            where: { difficulty: 'NEW', ...(deck_id ? { deck_id } : {}) },
            include: [
                {
                    model: StudyDeck,
                    as: 'deck',
                    where: deckWhere,
                    required: true,
                },
            ],
            limit: 20,
        });

        return { success: true, data: { due: cards, new: newCards } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const startReviewSession = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { deck_id, total_cards } = request.body;

        const session = await StudyReviewSession.create({
            user_id: userId,
            deck_id,
            total_cards: total_cards || 0,
        });
        reply.status(201);
        return { success: true, data: session, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const logReview = async (request, reply) => {
    try {
        const { sessionId } = request.params;
        const { flashcard_id, response_rating, time_spent_seconds } = request.body;

        // Log the review
        const log = await StudyReviewLog.create({
            session_id: sessionId,
            flashcard_id,
            response_rating,
            time_spent_seconds,
        });

        // Update flashcard using spaced repetition algorithm
        const flashcard = await StudyFlashcard.findByPk(flashcard_id);
        if (flashcard) {
            const updates = calculateNextReview(flashcard, response_rating);
            await flashcard.update(updates);
        }

        // Update session stats
        const isCorrect = ['GOOD', 'EASY'].includes(response_rating);
        await StudyReviewSession.increment(
            {
                cards_reviewed: 1,
                cards_correct: isCorrect ? 1 : 0,
            },
            { where: { id: sessionId } }
        );

        return { success: true, data: log };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const finishReviewSession = async (request, reply) => {
    try {
        const { sessionId } = request.params;
        const session = await StudyReviewSession.findByPk(sessionId);
        if (!session) {
            reply.status(404);
            return { success: false, error: 'Session not found' };
        }

        const score =
            session.cards_reviewed > 0
                ? (session.cards_correct / session.cards_reviewed) * 10
                : 0;

        await session.update({
            finished_at: new Date(),
            status: 'COMPLETED',
            score,
        });

        return { success: true, data: session };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// Helper function for spaced repetition (simplified FSRS)
function calculateNextReview(card, rating) {
    const now = new Date();
    let interval = card.interval_days || 0;
    let ease = parseFloat(card.ease_factor) || 2.5;
    let difficulty = card.difficulty;
    let lapses = card.lapses || 0;

    switch (rating) {
        case 'AGAIN':
            interval = 0.0007; // ~1 minute
            ease = Math.max(1.3, ease - 0.2);
            difficulty = 'RELEARNING';
            lapses += 1;
            break;
        case 'HARD':
            interval = interval * 1.2;
            ease = Math.max(1.3, ease - 0.15);
            difficulty = 'REVIEW';
            break;
        case 'GOOD':
            interval = interval === 0 ? 1 : interval * ease;
            difficulty = 'REVIEW';
            break;
        case 'EASY':
            interval = interval === 0 ? 4 : interval * ease * 1.3;
            ease = ease + 0.15;
            difficulty = 'REVIEW';
            break;
    }

    const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

    return {
        interval_days: interval,
        ease_factor: ease,
        difficulty,
        lapses,
        next_review_at: nextReview,
        last_review_at: now,
        review_count: (card.review_count || 0) + 1,
    };
}

// ==================== PROJECTS ====================

const getProjectTemplates = async (request, reply) => {
    try {
        const templates = await StudyProjectTemplate.findAll({
            order: [['name', 'ASC']],
        });
        return { success: true, data: templates };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getProjects = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { status } = request.query;
        const where = { user_id: userId };
        if (status) where.status = status;

        const projects = await StudyProject.findAll({
            where,
            include: [
                { model: StudyProjectTemplate, as: 'template' },
                { model: StudyProjectMilestone, as: 'milestones', order: [['order_index', 'ASC']] },
            ],
            order: [['deadline', 'ASC NULLS LAST']],
        });
        return { success: true, data: projects };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getProject = async (request, reply) => {
    try {
        const { id } = request.params;
        const project = await StudyProject.findByPk(id, {
            include: [
                { model: StudyProjectTemplate, as: 'template' },
                { model: StudyProjectMilestone, as: 'milestones', order: [['order_index', 'ASC']] },
                { model: StudyProjectResource, as: 'resources' },
                { model: StudyBook, as: 'books' },
                { model: StudyCourseOnline, as: 'coursesOnline' },
            ],
        });
        if (!project) {
            reply.status(404);
            return { success: false, error: 'Project not found' };
        }
        return { success: true, data: project };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createProject = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { milestones, template_id, ...projectData } = request.body;

        const project = await StudyProject.create({
            ...projectData,
            user_id: userId,
            template_id,
        });

        // Create milestones from template or request
        let milestonesToCreate = milestones || [];
        if (!milestones && template_id) {
            const template = await StudyProjectTemplate.findByPk(template_id);
            if (template && template.default_milestones) {
                milestonesToCreate = template.default_milestones;
            }
        }

        if (milestonesToCreate.length > 0) {
            await StudyProjectMilestone.bulkCreate(
                milestonesToCreate.map((m, i) => ({
                    project_id: project.id,
                    name: m.name,
                    description: m.description,
                    target_date: m.target_date,
                    order_index: m.order || i,
                }))
            );
        }

        const fullProject = await StudyProject.findByPk(project.id, {
            include: [{ model: StudyProjectMilestone, as: 'milestones' }],
        });
        reply.status(201);
        return { success: true, data: fullProject, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateProject = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await StudyProject.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Project not found' };
        }
        const project = await StudyProject.findByPk(id);
        return { success: true, data: project };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteProject = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudyProject.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Project not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateMilestone = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await StudyProjectMilestone.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Milestone not found' };
        }
        const milestone = await StudyProjectMilestone.findByPk(id);

        // Update project progress
        const project = await StudyProject.findByPk(milestone.project_id, {
            include: [{ model: StudyProjectMilestone, as: 'milestones' }],
        });
        if (project) {
            const total = project.milestones.length;
            const completed = project.milestones.filter((m) => m.completed_at).length;
            await project.update({ progress_percentage: Math.round((completed / total) * 100) });
        }

        return { success: true, data: milestone };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== FOCUS MODE ====================

const getFocusPresets = async (request, reply) => {
    try {
        const presets = await StudyFocusPreset.findAll({
            order: [['is_system', 'DESC'], ['name', 'ASC']],
        });
        return { success: true, data: presets };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getFocusSessions = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { status } = request.query;
        const where = { user_id: userId };
        if (status) where.status = status;

        const sessions = await StudyFocusSession.findAll({
            where,
            include: [
                { model: StudyFocusPreset, as: 'preset' },
                { model: StudyTopic, as: 'topic' },
                { model: StudySubject, as: 'subject' },
            ],
            order: [['started_at', 'DESC']],
            limit: 50,
        });
        return { success: true, data: sessions };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getActiveFocusSession = async (request, reply) => {
    try {
        const { userId } = request.params;
        const session = await StudyFocusSession.findOne({
            where: {
                user_id: userId,
                status: { [Op.in]: ['IN_PROGRESS', 'PAUSED'] },
            },
            include: [
                { model: StudyFocusPreset, as: 'preset' },
                { model: StudyTopic, as: 'topic' },
                { model: StudySubject, as: 'subject' },
                { model: StudyFocusBlock, as: 'blocks', order: [['block_number', 'ASC']] },
            ],
        });
        return { success: true, data: session };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const startFocusSession = async (request, reply) => {
    try {
        const { userId } = request.params;

        // Cancel any existing active session
        await StudyFocusSession.update(
            { status: 'CANCELLED', finished_at: new Date() },
            { where: { user_id: userId, status: { [Op.in]: ['IN_PROGRESS', 'PAUSED'] } } }
        );

        const session = await StudyFocusSession.create({
            ...request.body,
            user_id: userId,
        });

        // Create first study block
        const preset = request.body.preset_id
            ? await StudyFocusPreset.findByPk(request.body.preset_id)
            : null;
        const blockMinutes = request.body.custom_block_minutes || (preset ? preset.block_minutes : 25);

        await StudyFocusBlock.create({
            session_id: session.id,
            block_number: 1,
            block_type: 'STUDY',
            planned_duration_minutes: blockMinutes,
        });

        const fullSession = await StudyFocusSession.findByPk(session.id, {
            include: [
                { model: StudyFocusPreset, as: 'preset' },
                { model: StudyFocusBlock, as: 'blocks' },
            ],
        });
        reply.status(201);
        return { success: true, data: fullSession, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const completeFocusBlock = async (request, reply) => {
    try {
        const { sessionId } = request.params;
        const { skipped } = request.body;

        const session = await StudyFocusSession.findByPk(sessionId, {
            include: [
                { model: StudyFocusPreset, as: 'preset' },
                { model: StudyFocusBlock, as: 'blocks', order: [['block_number', 'DESC']], limit: 1 },
            ],
        });

        if (!session) {
            reply.status(404);
            return { success: false, error: 'Session not found' };
        }

        const currentBlock = session.blocks[0];
        if (!currentBlock) {
            reply.status(400);
            return { success: false, error: 'No active block' };
        }

        const now = new Date();
        const startedAt = new Date(currentBlock.started_at);
        const actualMinutes = Math.round((now - startedAt) / 60000);

        // Complete current block
        await currentBlock.update({
            finished_at: now,
            actual_duration_minutes: actualMinutes,
            skipped: skipped || false,
        });

        // Update session stats
        const updates = {};
        if (currentBlock.block_type === 'STUDY') {
            updates.total_focus_minutes = (session.total_focus_minutes || 0) + actualMinutes;
            updates.completed_blocks = (session.completed_blocks || 0) + 1;
        } else {
            updates.total_break_minutes = (session.total_break_minutes || 0) + actualMinutes;
            if (skipped) {
                updates.skipped_breaks = (session.skipped_breaks || 0) + 1;
            }
        }
        await session.update(updates);

        // Determine next block type
        const preset = session.preset;
        const completedBlocks = updates.completed_blocks || session.completed_blocks;
        const plannedBlocks = session.planned_blocks;

        if (plannedBlocks && completedBlocks >= plannedBlocks) {
            // Session complete
            await session.update({ status: 'COMPLETED', finished_at: now });
            return { success: true, data: { session, completed: true } };
        }

        // Create next block
        let nextType, nextDuration;
        if (currentBlock.block_type === 'STUDY') {
            // After study, take a break
            const blocksUntilLong = preset ? preset.blocks_until_long_break : 4;
            if (completedBlocks % blocksUntilLong === 0) {
                nextType = 'LONG_BREAK';
                nextDuration = session.custom_break_minutes || (preset ? preset.long_break_minutes : 15);
            } else {
                nextType = 'SHORT_BREAK';
                nextDuration = session.custom_break_minutes || (preset ? preset.short_break_minutes : 5);
            }
        } else {
            // After break, study
            nextType = 'STUDY';
            nextDuration = session.custom_block_minutes || (preset ? preset.block_minutes : 25);
        }

        const nextBlock = await StudyFocusBlock.create({
            session_id: sessionId,
            block_number: currentBlock.block_number + 1,
            block_type: nextType,
            planned_duration_minutes: nextDuration,
        });

        return { success: true, data: { session, nextBlock } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const pauseFocusSession = async (request, reply) => {
    try {
        const { sessionId } = request.params;
        const [updated] = await StudyFocusSession.update(
            { status: 'PAUSED' },
            { where: { id: sessionId } }
        );
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Session not found' };
        }
        const session = await StudyFocusSession.findByPk(sessionId);
        return { success: true, data: session };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const resumeFocusSession = async (request, reply) => {
    try {
        const { sessionId } = request.params;
        const [updated] = await StudyFocusSession.update(
            { status: 'IN_PROGRESS' },
            { where: { id: sessionId } }
        );
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Session not found' };
        }
        const session = await StudyFocusSession.findByPk(sessionId);
        return { success: true, data: session };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const cancelFocusSession = async (request, reply) => {
    try {
        const { sessionId } = request.params;
        const [updated] = await StudyFocusSession.update(
            { status: 'CANCELLED', finished_at: new Date() },
            { where: { id: sessionId } }
        );
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Session not found' };
        }
        return { success: true, data: { cancelled: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== STATS ====================

const getStudyStats = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { period } = request.query; // week, month, all

        let dateFrom = null;
        if (period === 'week') {
            dateFrom = new Date();
            dateFrom.setDate(dateFrom.getDate() - 7);
        } else if (period === 'month') {
            dateFrom = new Date();
            dateFrom.setMonth(dateFrom.getMonth() - 1);
        }

        const focusWhere = { user_id: userId, status: 'COMPLETED' };
        const reviewWhere = { user_id: userId, status: 'COMPLETED' };
        if (dateFrom) {
            focusWhere.finished_at = { [Op.gte]: dateFrom };
            reviewWhere.finished_at = { [Op.gte]: dateFrom };
        }

        // Focus stats
        const focusSessions = await StudyFocusSession.findAll({ where: focusWhere });
        const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + (s.total_focus_minutes || 0), 0);
        const totalFocusSessions = focusSessions.length;

        // Review stats
        const reviewSessions = await StudyReviewSession.findAll({ where: reviewWhere });
        const totalCardsReviewed = reviewSessions.reduce((sum, s) => sum + (s.cards_reviewed || 0), 0);
        const avgScore = reviewSessions.length > 0
            ? reviewSessions.reduce((sum, s) => sum + (parseFloat(s.score) || 0), 0) / reviewSessions.length
            : 0;

        // Books/courses progress
        const booksInProgress = await StudyBook.count({
            where: { user_id: userId, status: 'IN_PROGRESS' },
        });
        const booksCompleted = await StudyBook.count({
            where: { user_id: userId, status: 'COMPLETED' },
        });
        const coursesInProgress = await StudyCourseOnline.count({
            where: { user_id: userId, status: 'IN_PROGRESS' },
        });
        const coursesCompleted = await StudyCourseOnline.count({
            where: { user_id: userId, status: 'COMPLETED' },
        });

        // Topics
        const topicsMastered = await StudyTopic.count({
            where: { user_id: userId, status: 'MASTERED' },
        });
        const topicsNeedReview = await StudyTopic.count({
            where: { user_id: userId, status: 'NEEDS_REVIEW' },
        });

        return {
            success: true,
            data: {
                focus: {
                    totalMinutes: totalFocusMinutes,
                    totalSessions: totalFocusSessions,
                    averageSessionMinutes: totalFocusSessions > 0 ? Math.round(totalFocusMinutes / totalFocusSessions) : 0,
                },
                review: {
                    totalCards: totalCardsReviewed,
                    totalSessions: reviewSessions.length,
                    averageScore: Math.round(avgScore * 10) / 10,
                },
                resources: {
                    booksInProgress,
                    booksCompleted,
                    coursesInProgress,
                    coursesCompleted,
                },
                topics: {
                    mastered: topicsMastered,
                    needReview: topicsNeedReview,
                },
            },
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== LIBRARY SHELVES (existing) ====================

const getLibraryShelves = async (request, reply) => {
    try {
        const { userId } = request.params;
        const items = await LibraryShelf.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
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
            user_id: userId,
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
            where: { id },
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

// ==================== STUDY SESSIONS (existing) ====================

const getStudySessions = async (request, reply) => {
    try {
        const { userId } = request.params;
        const sessions = await StudySession.findAll({
            where: { user_id: userId },
            order: [['start_time', 'DESC']],
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
            user_id: userId,
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
            where: { id },
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

// ==================== SPACED REVIEWS (existing) ====================

const getSpacedReviews = async (request, reply) => {
    try {
        const { userId } = request.params;
        const reviews = await SpacedReview.findAll({
            where: { user_id: userId },
            order: [['next_review_date', 'ASC']],
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
        const today = new Date().toISOString().split('T')[0];
        const reviews = await SpacedReview.findAll({
            where: {
                user_id: userId,
                next_review_date: { [Op.lte]: today },
            },
            order: [['next_review_date', 'ASC']],
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
            user_id: userId,
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
            where: { id },
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

// ==================== NOTES (existing) ====================

const getNotes = async (request, reply) => {
    try {
        const { userId } = request.params;
        const notes = await Note.findAll({
            where: { user_id: userId },
            order: [
                ['is_pinned', 'DESC'],
                ['updated_at', 'DESC'],
            ],
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
            user_id: userId,
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
            where: { id },
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

// ==================== MISSING FUNCTIONS (for routes compatibility) ====================

const getPeriod = async (request, reply) => {
    try {
        const { id } = request.params;
        const period = await StudyPeriod.findByPk(id, {
            include: [{ model: StudySubject, as: 'subjects' }],
        });
        if (!period) {
            reply.status(404);
            return { success: false, error: 'Period not found' };
        }
        return { success: true, data: period };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getAllUserSubjects = async (request, reply) => {
    try {
        const { userId } = request.params;
        const subjects = await StudySubject.findAll({
            include: [{
                model: StudyPeriod,
                as: 'period',
                include: [{
                    model: StudyCourse,
                    as: 'course',
                    where: { user_id: userId },
                }],
            }],
        });
        return { success: true, data: subjects };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getSubjectWeights = async (request, reply) => {
    try {
        const { subjectId } = request.params;
        const weights = await StudySubjectWeight.findAll({
            where: { subject_id: subjectId },
        });
        return { success: true, data: weights };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createSubjectWeight = async (request, reply) => {
    try {
        const { subjectId } = request.params;
        const weight = await StudySubjectWeight.create({
            ...request.body,
            subject_id: subjectId,
        });
        return { success: true, data: weight };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateSubjectWeight = async (request, reply) => {
    try {
        const { id } = request.params;
        const weight = await StudySubjectWeight.findByPk(id);
        if (!weight) {
            reply.status(404);
            return { success: false, error: 'Weight not found' };
        }
        await weight.update(request.body);
        return { success: true, data: weight };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteSubjectWeight = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudySubjectWeight.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Weight not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getUpcomingEvaluations = async (request, reply) => {
    try {
        const { userId } = request.params;
        const evaluations = await StudyEvaluation.findAll({
            where: {
                date: { [Op.gte]: new Date() },
            },
            include: [{
                model: StudySubject,
                as: 'subject',
                include: [{
                    model: StudyPeriod,
                    as: 'period',
                    include: [{
                        model: StudyCourse,
                        as: 'course',
                        where: { user_id: userId },
                    }],
                }],
            }],
            order: [['date', 'ASC']],
            limit: 10,
        });
        return { success: true, data: evaluations };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getEvaluation = async (request, reply) => {
    try {
        const { id } = request.params;
        const evaluation = await StudyEvaluation.findByPk(id, {
            include: [
                { model: StudySubject, as: 'subject' },
                { model: StudyEvaluationTopic, as: 'topics' },
                { model: StudyEvaluationFeedback, as: 'feedback' },
            ],
        });
        if (!evaluation) {
            reply.status(404);
            return { success: false, error: 'Evaluation not found' };
        }
        return { success: true, data: evaluation };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getEvaluationFeedback = async (request, reply) => {
    try {
        const { evaluationId } = request.params;
        const feedback = await StudyEvaluationFeedback.findOne({
            where: { evaluation_id: evaluationId },
        });
        return { success: true, data: feedback };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateEvaluationFeedback = async (request, reply) => {
    try {
        const { id } = request.params;
        const feedback = await StudyEvaluationFeedback.findByPk(id);
        if (!feedback) {
            reply.status(404);
            return { success: false, error: 'Feedback not found' };
        }
        await feedback.update(request.body);
        return { success: true, data: feedback };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getBook = async (request, reply) => {
    try {
        const { id } = request.params;
        const book = await StudyBook.findByPk(id);
        if (!book) {
            reply.status(404);
            return { success: false, error: 'Book not found' };
        }
        return { success: true, data: book };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getCourseOnline = async (request, reply) => {
    try {
        const { id } = request.params;
        const course = await StudyCourseOnline.findByPk(id);
        if (!course) {
            reply.status(404);
            return { success: false, error: 'Online course not found' };
        }
        return { success: true, data: course };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getTopic = async (request, reply) => {
    try {
        const { id } = request.params;
        const topic = await StudyTopic.findByPk(id);
        if (!topic) {
            reply.status(404);
            return { success: false, error: 'Topic not found' };
        }
        return { success: true, data: topic };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getRetentionHistory = async (request, reply) => {
    try {
        const { topicId } = request.params;
        const logs = await StudyRetentionLog.findAll({
            where: { topic_id: topicId },
            order: [['created_at', 'DESC']],
        });
        return { success: true, data: logs };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getDeck = async (request, reply) => {
    try {
        const { id } = request.params;
        const deck = await StudyDeck.findByPk(id, {
            include: [{ model: StudyFlashcard, as: 'cards' }],
        });
        if (!deck) {
            reply.status(404);
            return { success: false, error: 'Deck not found' };
        }
        return { success: true, data: deck };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getFlashcard = async (request, reply) => {
    try {
        const { id } = request.params;
        const card = await StudyFlashcard.findByPk(id);
        if (!card) {
            reply.status(404);
            return { success: false, error: 'Flashcard not found' };
        }
        return { success: true, data: card };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createFlashcardsBulk = async (request, reply) => {
    try {
        const { deckId } = request.params;
        const { cards } = request.body;
        const createdCards = await StudyFlashcard.bulkCreate(
            cards.map(card => ({ ...card, deck_id: deckId }))
        );
        return { success: true, data: createdCards };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getReviewSessions = async (request, reply) => {
    try {
        const { userId } = request.params;
        const sessions = await StudyReviewSession.findAll({
            where: { user_id: userId },
            include: [{ model: StudyDeck, as: 'deck' }],
            order: [['created_at', 'DESC']],
        });
        return { success: true, data: sessions };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getProjectTemplate = async (request, reply) => {
    try {
        const { id } = request.params;
        const template = await StudyProjectTemplate.findByPk(id);
        if (!template) {
            reply.status(404);
            return { success: false, error: 'Template not found' };
        }
        return { success: true, data: template };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const addProjectResource = async (request, reply) => {
    try {
        const { projectId } = request.params;
        const resource = await StudyProjectResource.create({
            ...request.body,
            project_id: projectId,
        });
        return { success: true, data: resource };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateProjectResource = async (request, reply) => {
    try {
        const { id } = request.params;
        const resource = await StudyProjectResource.findByPk(id);
        if (!resource) {
            reply.status(404);
            return { success: false, error: 'Resource not found' };
        }
        await resource.update(request.body);
        return { success: true, data: resource };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const removeProjectResource = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudyProjectResource.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Resource not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const addProjectMilestone = async (request, reply) => {
    try {
        const { projectId } = request.params;
        const milestone = await StudyProjectMilestone.create({
            ...request.body,
            project_id: projectId,
        });
        return { success: true, data: milestone };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const removeProjectMilestone = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await StudyProjectMilestone.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Milestone not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getFocusSession = async (request, reply) => {
    try {
        const { id } = request.params;
        const session = await StudyFocusSession.findByPk(id, {
            include: [{ model: StudyFocusBlock, as: 'blocks' }],
        });
        if (!session) {
            reply.status(404);
            return { success: false, error: 'Focus session not found' };
        }
        return { success: true, data: session };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateFocusSession = async (request, reply) => {
    try {
        const { id } = request.params;
        const session = await StudyFocusSession.findByPk(id);
        if (!session) {
            reply.status(404);
            return { success: false, error: 'Focus session not found' };
        }
        await session.update(request.body);
        return { success: true, data: session };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const completeFocusSession = async (request, reply) => {
    try {
        const { id } = request.params;
        const session = await StudyFocusSession.findByPk(id, {
            include: [{ model: StudyFocusBlock, as: 'blocks' }],
        });
        if (!session) {
            reply.status(404);
            return { success: false, error: 'Focus session not found' };
        }
        await session.update({
            status: 'completed',
            ended_at: new Date(),
        });
        return { success: true, data: session };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const addFocusBlock = async (request, reply) => {
    try {
        const { sessionId } = request.params;
        const block = await StudyFocusBlock.create({
            ...request.body,
            session_id: sessionId,
        });
        return { success: true, data: block };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateFocusBlock = async (request, reply) => {
    try {
        const { id } = request.params;
        const block = await StudyFocusBlock.findByPk(id);
        if (!block) {
            reply.status(404);
            return { success: false, error: 'Focus block not found' };
        }
        await block.update(request.body);
        return { success: true, data: block };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getStudyStreak = async (request, reply) => {
    try {
        const { userId } = request.params;
        const settings = await StudySettings.findOne({ where: { user_id: userId } });
        return {
            success: true,
            data: {
                currentStreak: settings?.current_streak || 0,
                longestStreak: settings?.longest_streak || 0,
            }
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getDueToday = async (request, reply) => {
    try {
        const { userId } = request.params;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get due flashcards
        const dueCards = await StudyFlashcard.findAll({
            where: {
                due_date: { [Op.lt]: tomorrow },
            },
            include: [{
                model: StudyDeck,
                as: 'deck',
                where: { user_id: userId },
            }],
        });

        // Get upcoming evaluations
        const evaluations = await StudyEvaluation.findAll({
            where: {
                date: { [Op.between]: [today, tomorrow] },
            },
            include: [{
                model: StudySubject,
                as: 'subject',
                include: [{
                    model: StudyPeriod,
                    as: 'period',
                    include: [{
                        model: StudyCourse,
                        as: 'course',
                        where: { user_id: userId },
                    }],
                }],
            }],
        });

        return {
            success: true,
            data: {
                dueCards: dueCards.length,
                evaluationsToday: evaluations.length,
            }
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    // Settings
    getStudySettings,
    updateStudySettings,
    getSettings: getStudySettings,
    updateSettings: updateStudySettings,
    // Courses
    getCourses,
    getCourse,
    getCourseById: getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    // Periods
    getPeriods,
    getPeriod,
    getPeriodById: getPeriod,
    createPeriod,
    updatePeriod,
    deletePeriod,
    // Subjects
    getSubjects,
    getSubject,
    getSubjectById: getSubject,
    getAllUserSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    // Subject Weights
    getSubjectWeights,
    createSubjectWeight,
    updateSubjectWeight,
    deleteSubjectWeight,
    // Evaluations
    getEvaluations,
    getEvaluation,
    getEvaluationById: getEvaluation,
    getUpcomingEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    createEvaluationFeedback,
    getEvaluationFeedback,
    updateEvaluationFeedback,
    // Topics
    getTopics,
    getTopic,
    getTopicById: getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
    logRetention,
    getRetentionHistory,
    // Books
    getBooks,
    getBook,
    getBookById: getBook,
    createBook,
    updateBook,
    deleteBook,
    // Online Courses
    getCoursesOnline,
    getCourseOnline,
    getCourseOnlineById: getCourseOnline,
    createCourseOnline,
    updateCourseOnline,
    deleteCourseOnline,
    // Progress
    logProgress,
    getProgressLogs,
    // Decks & Flashcards
    getDecks,
    getDeck,
    getDeckById: getDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    getFlashcards,
    getFlashcard,
    getFlashcardById: getFlashcard,
    createFlashcard,
    createFlashcardsBulk,
    updateFlashcard,
    deleteFlashcard,
    getDueCards,
    getDueFlashcards: getDueCards,
    // Review Sessions
    getReviewSessions,
    startReviewSession,
    logReview,
    finishReviewSession,
    completeReviewSession: finishReviewSession,
    // Projects
    getProjectTemplates,
    getProjectTemplate,
    getProjectTemplateById: getProjectTemplate,
    getProjects,
    getProject,
    getProjectById: getProject,
    createProject,
    updateProject,
    deleteProject,
    addProjectResource,
    updateProjectResource,
    removeProjectResource,
    addProjectMilestone,
    updateMilestone,
    updateProjectMilestone: updateMilestone,
    removeProjectMilestone,
    // Focus Mode
    getFocusPresets,
    getFocusSessions,
    getFocusSession,
    getFocusSessionById: getFocusSession,
    getActiveFocusSession,
    startFocusSession,
    updateFocusSession,
    completeFocusBlock,
    completeFocusSession,
    addFocusBlock,
    updateFocusBlock,
    pauseFocusSession,
    resumeFocusSession,
    cancelFocusSession,
    // Stats
    getStudyStats,
    getStudyStreak,
    getDueToday,
    // Library Shelves (existing)
    getLibraryShelves,
    createLibraryShelf,
    updateLibraryShelf,
    deleteLibraryShelf,
    // Study Sessions (existing)
    getStudySessions,
    createStudySession,
    updateStudySession,
    deleteStudySession,
    // Spaced Reviews (existing)
    getSpacedReviews,
    getDueReviews,
    createSpacedReview,
    updateSpacedReview,
    deleteSpacedReview,
    // Notes (existing)
    getNotes,
    createNote,
    updateNote,
    deleteNote,
};
