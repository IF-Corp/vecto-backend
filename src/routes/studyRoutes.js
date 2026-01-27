const studyController = require('../controllers/studyController');
const { study, common } = require('../schemas');

async function studyRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== SETTINGS ====================
    fastify.get('/users/:userId/study/settings', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get study settings for a user',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getSettings);

    fastify.put('/users/:userId/study/settings', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update study settings for a user',
            tags: ['Study'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.updateSettingsBody
        }
    }, studyController.updateSettings);

    // ==================== COURSES (FORMAL EDUCATION) ====================
    fastify.get('/users/:userId/study/courses', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all courses for a user',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getCourses);

    fastify.get('/study/courses/:id', {
        schema: {
            description: 'Get a course by ID',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getCourseById);

    fastify.post('/users/:userId/study/courses', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new course',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createCourseBody
        }
    }, studyController.createCourse);

    fastify.put('/study/courses/:id', {
        schema: {
            description: 'Update a course',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateCourseBody
        }
    }, studyController.updateCourse);

    fastify.delete('/study/courses/:id', {
        schema: {
            description: 'Delete a course',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteCourse);

    // ==================== PERIODS ====================
    fastify.get('/study/courses/:courseId/periods', {
        schema: {
            description: 'Get all periods for a course',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    courseId: { type: 'string', format: 'uuid' }
                },
                required: ['courseId']
            }
        }
    }, studyController.getPeriods);

    fastify.get('/study/periods/:id', {
        schema: {
            description: 'Get a period by ID',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getPeriodById);

    fastify.post('/users/:userId/study/periods', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new period',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createPeriodBody
        }
    }, studyController.createPeriod);

    fastify.put('/study/periods/:id', {
        schema: {
            description: 'Update a period',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updatePeriodBody
        }
    }, studyController.updatePeriod);

    fastify.delete('/study/periods/:id', {
        schema: {
            description: 'Delete a period',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deletePeriod);

    // ==================== SUBJECTS ====================
    fastify.get('/study/periods/:periodId/subjects', {
        schema: {
            description: 'Get all subjects for a period',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    periodId: { type: 'string', format: 'uuid' }
                },
                required: ['periodId']
            }
        }
    }, studyController.getSubjects);

    fastify.get('/users/:userId/study/subjects', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all subjects for a user',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getAllUserSubjects);

    fastify.get('/study/subjects/:id', {
        schema: {
            description: 'Get a subject by ID',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getSubjectById);

    fastify.post('/users/:userId/study/subjects', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new subject',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createSubjectBody
        }
    }, studyController.createSubject);

    fastify.put('/study/subjects/:id', {
        schema: {
            description: 'Update a subject',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateSubjectBody
        }
    }, studyController.updateSubject);

    fastify.delete('/study/subjects/:id', {
        schema: {
            description: 'Delete a subject',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteSubject);

    // ==================== SUBJECT WEIGHTS ====================
    fastify.get('/study/subjects/:subjectId/weights', {
        schema: {
            description: 'Get all weights for a subject',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    subjectId: { type: 'string', format: 'uuid' }
                },
                required: ['subjectId']
            }
        }
    }, studyController.getSubjectWeights);

    fastify.post('/study/subjects/:subjectId/weights', {
        schema: {
            description: 'Create a subject weight',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    subjectId: { type: 'string', format: 'uuid' }
                },
                required: ['subjectId']
            },
            body: study.createSubjectWeightBody
        }
    }, studyController.createSubjectWeight);

    fastify.put('/study/weights/:id', {
        schema: {
            description: 'Update a subject weight',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateSubjectWeightBody
        }
    }, studyController.updateSubjectWeight);

    fastify.delete('/study/weights/:id', {
        schema: {
            description: 'Delete a subject weight',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteSubjectWeight);

    // ==================== EVALUATIONS ====================
    fastify.get('/study/subjects/:subjectId/evaluations', {
        schema: {
            description: 'Get all evaluations for a subject',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    subjectId: { type: 'string', format: 'uuid' }
                },
                required: ['subjectId']
            }
        }
    }, studyController.getEvaluations);

    fastify.get('/users/:userId/study/evaluations/upcoming', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get upcoming evaluations for a user',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getUpcomingEvaluations);

    fastify.get('/study/evaluations/:id', {
        schema: {
            description: 'Get an evaluation by ID',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getEvaluationById);

    fastify.post('/users/:userId/study/evaluations', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create an evaluation',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createEvaluationBody
        }
    }, studyController.createEvaluation);

    fastify.put('/study/evaluations/:id', {
        schema: {
            description: 'Update an evaluation',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateEvaluationBody
        }
    }, studyController.updateEvaluation);

    fastify.delete('/study/evaluations/:id', {
        schema: {
            description: 'Delete an evaluation',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteEvaluation);

    // ==================== EVALUATION FEEDBACK ====================
    fastify.get('/study/evaluations/:evaluationId/feedback', {
        schema: {
            description: 'Get feedback for an evaluation',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    evaluationId: { type: 'string', format: 'uuid' }
                },
                required: ['evaluationId']
            }
        }
    }, studyController.getEvaluationFeedback);

    fastify.post('/study/evaluations/:evaluationId/feedback', {
        schema: {
            description: 'Create feedback for an evaluation',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    evaluationId: { type: 'string', format: 'uuid' }
                },
                required: ['evaluationId']
            },
            body: study.createEvaluationFeedbackBody
        }
    }, studyController.createEvaluationFeedback);

    fastify.put('/study/feedback/:id', {
        schema: {
            description: 'Update evaluation feedback',
            tags: ['Study - Formal Education'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateEvaluationFeedbackBody
        }
    }, studyController.updateEvaluationFeedback);

    // ==================== BOOKS ====================
    fastify.get('/users/:userId/study/books', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all books for a user',
            tags: ['Study - Resources'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getBooks);

    fastify.get('/study/books/:id', {
        schema: {
            description: 'Get a book by ID',
            tags: ['Study - Resources'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getBookById);

    fastify.post('/users/:userId/study/books', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new book',
            tags: ['Study - Resources'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createBookBody
        }
    }, studyController.createBook);

    fastify.put('/study/books/:id', {
        schema: {
            description: 'Update a book',
            tags: ['Study - Resources'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateBookBody
        }
    }, studyController.updateBook);

    fastify.delete('/study/books/:id', {
        schema: {
            description: 'Delete a book',
            tags: ['Study - Resources'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteBook);

    // ==================== ONLINE COURSES ====================
    fastify.get('/users/:userId/study/courses-online', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all online courses for a user',
            tags: ['Study - Resources'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getCoursesOnline);

    fastify.get('/study/courses-online/:id', {
        schema: {
            description: 'Get an online course by ID',
            tags: ['Study - Resources'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getCourseOnlineById);

    fastify.post('/users/:userId/study/courses-online', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new online course',
            tags: ['Study - Resources'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createCourseOnlineBody
        }
    }, studyController.createCourseOnline);

    fastify.put('/study/courses-online/:id', {
        schema: {
            description: 'Update an online course',
            tags: ['Study - Resources'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateCourseOnlineBody
        }
    }, studyController.updateCourseOnline);

    fastify.delete('/study/courses-online/:id', {
        schema: {
            description: 'Delete an online course',
            tags: ['Study - Resources'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteCourseOnline);

    // ==================== TOPICS ====================
    fastify.get('/users/:userId/study/topics', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all topics for a user',
            tags: ['Study - Topics'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    source_type: study.topicSourceTypeEnum,
                    source_id: { type: 'string', format: 'uuid' }
                }
            }
        }
    }, studyController.getTopics);

    fastify.get('/study/topics/:id', {
        schema: {
            description: 'Get a topic by ID',
            tags: ['Study - Topics'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getTopicById);

    fastify.post('/users/:userId/study/topics', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new topic',
            tags: ['Study - Topics'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createTopicBody
        }
    }, studyController.createTopic);

    fastify.put('/study/topics/:id', {
        schema: {
            description: 'Update a topic',
            tags: ['Study - Topics'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateTopicBody
        }
    }, studyController.updateTopic);

    fastify.delete('/study/topics/:id', {
        schema: {
            description: 'Delete a topic',
            tags: ['Study - Topics'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteTopic);

    // ==================== PROGRESS LOGS ====================
    fastify.post('/users/:userId/study/progress', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Log study progress',
            tags: ['Study - Progress'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createProgressLogBody
        }
    }, studyController.logProgress);

    fastify.get('/users/:userId/study/progress', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get progress logs for a user',
            tags: ['Study - Progress'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    progress_type: study.progressTypeEnum,
                    reference_id: { type: 'string', format: 'uuid' },
                    start_date: { type: 'string', format: 'date' },
                    end_date: { type: 'string', format: 'date' }
                }
            }
        }
    }, studyController.getProgressLogs);

    // ==================== RETENTION LOGS ====================
    fastify.post('/users/:userId/study/retention', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Log topic retention',
            tags: ['Study - Progress'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createRetentionLogBody
        }
    }, studyController.logRetention);

    fastify.get('/study/topics/:topicId/retention', {
        schema: {
            description: 'Get retention history for a topic',
            tags: ['Study - Progress'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    topicId: { type: 'string', format: 'uuid' }
                },
                required: ['topicId']
            }
        }
    }, studyController.getRetentionHistory);

    // ==================== DECKS ====================
    fastify.get('/users/:userId/study/decks', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all flashcard decks for a user',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getDecks);

    fastify.get('/study/decks/:id', {
        schema: {
            description: 'Get a deck by ID with card counts',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getDeckById);

    fastify.post('/users/:userId/study/decks', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new deck',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createDeckBody
        }
    }, studyController.createDeck);

    fastify.put('/study/decks/:id', {
        schema: {
            description: 'Update a deck',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateDeckBody
        }
    }, studyController.updateDeck);

    fastify.delete('/study/decks/:id', {
        schema: {
            description: 'Delete a deck',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteDeck);

    // ==================== FLASHCARDS ====================
    fastify.get('/study/decks/:deckId/flashcards', {
        schema: {
            description: 'Get all flashcards in a deck',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    deckId: { type: 'string', format: 'uuid' }
                },
                required: ['deckId']
            }
        }
    }, studyController.getFlashcards);

    fastify.get('/study/decks/:deckId/flashcards/due', {
        schema: {
            description: 'Get due flashcards for review in a deck',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    deckId: { type: 'string', format: 'uuid' }
                },
                required: ['deckId']
            },
            querystring: {
                type: 'object',
                properties: {
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
                }
            }
        }
    }, studyController.getDueFlashcards);

    fastify.get('/study/flashcards/:id', {
        schema: {
            description: 'Get a flashcard by ID',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getFlashcardById);

    fastify.post('/study/flashcards', {
        schema: {
            description: 'Create a new flashcard',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            body: study.createFlashcardBody
        }
    }, studyController.createFlashcard);

    fastify.post('/study/flashcards/bulk', {
        schema: {
            description: 'Create multiple flashcards at once',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    deck_id: { type: 'string', format: 'uuid' },
                    cards: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                front_content: { type: 'string', minLength: 1, maxLength: 5000 },
                                back_content: { type: 'string', minLength: 1, maxLength: 5000 },
                                tags: { type: 'array', items: { type: 'string' }, default: [] }
                            },
                            required: ['front_content', 'back_content']
                        },
                        minItems: 1,
                        maxItems: 100
                    }
                },
                required: ['deck_id', 'cards']
            }
        }
    }, studyController.createFlashcardsBulk);

    fastify.put('/study/flashcards/:id', {
        schema: {
            description: 'Update a flashcard',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateFlashcardBody
        }
    }, studyController.updateFlashcard);

    fastify.delete('/study/flashcards/:id', {
        schema: {
            description: 'Delete a flashcard',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteFlashcard);

    // ==================== REVIEW SESSIONS ====================
    fastify.get('/users/:userId/study/review-sessions', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get review session history for a user',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
                }
            }
        }
    }, studyController.getReviewSessions);

    fastify.post('/users/:userId/study/review-sessions', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Start a new review session',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createReviewSessionBody
        }
    }, studyController.startReviewSession);

    fastify.put('/study/review-sessions/:id/complete', {
        schema: {
            description: 'Complete a review session',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.completeReviewSessionBody
        }
    }, studyController.completeReviewSession);

    // ==================== REVIEW LOGS (INDIVIDUAL CARD REVIEWS) ====================
    fastify.post('/study/review-logs', {
        schema: {
            description: 'Log a flashcard review (processes FSRS algorithm)',
            tags: ['Study - Flashcards'],
            security: [{ bearerAuth: [] }],
            body: study.createReviewLogBody
        }
    }, studyController.logReview);

    // ==================== PROJECT TEMPLATES ====================
    fastify.get('/study/project-templates', {
        schema: {
            description: 'Get all available project templates',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }]
        }
    }, studyController.getProjectTemplates);

    fastify.get('/study/project-templates/:id', {
        schema: {
            description: 'Get a project template by ID',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getProjectTemplateById);

    // ==================== PROJECTS ====================
    fastify.get('/users/:userId/study/projects', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all projects for a user',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getProjects);

    fastify.get('/study/projects/:id', {
        schema: {
            description: 'Get a project by ID with resources and milestones',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getProjectById);

    fastify.post('/users/:userId/study/projects', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new project',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createProjectBody
        }
    }, studyController.createProject);

    fastify.put('/study/projects/:id', {
        schema: {
            description: 'Update a project',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateProjectBody
        }
    }, studyController.updateProject);

    fastify.delete('/study/projects/:id', {
        schema: {
            description: 'Delete a project',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.deleteProject);

    // ==================== PROJECT RESOURCES ====================
    fastify.post('/study/projects/:projectId/resources', {
        schema: {
            description: 'Add a resource to a project',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    projectId: { type: 'string', format: 'uuid' }
                },
                required: ['projectId']
            },
            body: study.createProjectResourceBody
        }
    }, studyController.addProjectResource);

    fastify.put('/study/project-resources/:id', {
        schema: {
            description: 'Update a project resource',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateProjectResourceBody
        }
    }, studyController.updateProjectResource);

    fastify.delete('/study/project-resources/:id', {
        schema: {
            description: 'Remove a resource from a project',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.removeProjectResource);

    // ==================== PROJECT MILESTONES ====================
    fastify.post('/study/projects/:projectId/milestones', {
        schema: {
            description: 'Add a milestone to a project',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    projectId: { type: 'string', format: 'uuid' }
                },
                required: ['projectId']
            },
            body: study.createMilestoneBody
        }
    }, studyController.addProjectMilestone);

    fastify.put('/study/milestones/:id', {
        schema: {
            description: 'Update a project milestone',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateMilestoneBody
        }
    }, studyController.updateProjectMilestone);

    fastify.delete('/study/milestones/:id', {
        schema: {
            description: 'Remove a milestone from a project',
            tags: ['Study - Projects'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.removeProjectMilestone);

    // ==================== FOCUS PRESETS ====================
    fastify.get('/study/focus-presets', {
        schema: {
            description: 'Get all available focus presets',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }]
        }
    }, studyController.getFocusPresets);

    // ==================== FOCUS SESSIONS ====================
    fastify.get('/users/:userId/study/focus-sessions', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get focus session history for a user',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
                    status: study.focusSessionStatusEnum
                }
            }
        }
    }, studyController.getFocusSessions);

    fastify.get('/users/:userId/study/focus-sessions/active', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get the active focus session for a user (if any)',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getActiveFocusSession);

    fastify.get('/study/focus-sessions/:id', {
        schema: {
            description: 'Get a focus session by ID with blocks',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.getFocusSessionById);

    fastify.post('/users/:userId/study/focus-sessions', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Start a new focus session',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: study.createFocusSessionBody
        }
    }, studyController.startFocusSession);

    fastify.put('/study/focus-sessions/:id', {
        schema: {
            description: 'Update a focus session',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateFocusSessionBody
        }
    }, studyController.updateFocusSession);

    fastify.put('/study/focus-sessions/:id/pause', {
        schema: {
            description: 'Pause a focus session',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.pauseFocusSession);

    fastify.put('/study/focus-sessions/:id/resume', {
        schema: {
            description: 'Resume a paused focus session',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.resumeFocusSession);

    fastify.put('/study/focus-sessions/:id/complete', {
        schema: {
            description: 'Complete a focus session',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.completeFocusSession);

    fastify.put('/study/focus-sessions/:id/cancel', {
        schema: {
            description: 'Cancel a focus session',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, studyController.cancelFocusSession);

    // ==================== FOCUS BLOCKS ====================
    fastify.post('/study/focus-sessions/:sessionId/blocks', {
        schema: {
            description: 'Add a block to a focus session',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    sessionId: { type: 'string', format: 'uuid' }
                },
                required: ['sessionId']
            },
            body: study.createFocusBlockBody
        }
    }, studyController.addFocusBlock);

    fastify.put('/study/focus-blocks/:id', {
        schema: {
            description: 'Update a focus block',
            tags: ['Study - Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: study.updateFocusBlockBody
        }
    }, studyController.updateFocusBlock);

    // ==================== STATS & DASHBOARD ====================
    fastify.get('/users/:userId/study/stats', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get study statistics for a user',
            tags: ['Study - Dashboard'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    period: { type: 'string', enum: ['day', 'week', 'month', 'year', 'all'], default: 'week' }
                }
            }
        }
    }, studyController.getStudyStats);

    fastify.get('/users/:userId/study/streak', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get study streak for a user',
            tags: ['Study - Dashboard'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getStudyStreak);

    fastify.get('/users/:userId/study/due-today', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get items due for review today',
            tags: ['Study - Dashboard'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, studyController.getDueToday);

    // ==================== LEGACY ROUTES (KEPT FOR COMPATIBILITY) ====================
    // Library Shelves
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

    // Study Sessions (legacy)
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

    // Spaced Reviews (legacy)
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

    // Notes (legacy)
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
