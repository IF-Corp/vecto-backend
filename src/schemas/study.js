// Study module schemas

// ==================== ENUMS ====================
const shelfTypeEnum = { type: 'string', enum: ['READING', 'WANT_TO_READ', 'FINISHED'] };
const itemTypeEnum = { type: 'string', enum: ['BOOK', 'ARTICLE', 'VIDEO', 'COURSE', 'OTHER'] };
const reviewDifficultyEnum = { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'] };
const courseStatusEnum = { type: 'string', enum: ['ACTIVE', 'COMPLETED', 'PAUSED', 'DROPPED'] };
const periodStatusEnum = { type: 'string', enum: ['UPCOMING', 'IN_PROGRESS', 'COMPLETED'] };
const bookStatusEnum = { type: 'string', enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED'] };
const bookFormatEnum = { type: 'string', enum: ['PHYSICAL', 'KINDLE', 'PDF', 'AUDIOBOOK_ONLY'] };
const courseOnlineStatusEnum = { type: 'string', enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED'] };
const topicStatusEnum = { type: 'string', enum: ['NOT_STARTED', 'LEARNING', 'REVIEWING', 'MASTERED'] };
const topicSourceTypeEnum = { type: 'string', enum: ['SUBJECT', 'BOOK', 'COURSE_ONLINE', 'PROJECT', 'STANDALONE'] };
const evaluationTypeEnum = { type: 'string', enum: ['EXAM', 'ASSIGNMENT', 'PROJECT', 'PRESENTATION', 'QUIZ', 'OTHER'] };
const flashcardDifficultyEnum = { type: 'string', enum: ['NEW', 'LEARNING', 'RELEARNING', 'REVIEW', 'MASTERED'] };
const reviewRatingEnum = { type: 'string', enum: ['AGAIN', 'HARD', 'GOOD', 'EASY'] };
const projectStatusEnum = { type: 'string', enum: ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'] };
const resourceTypeEnum = { type: 'string', enum: ['BOOK', 'COURSE_ONLINE', 'SUBJECT', 'DECK'] };
const focusSessionStatusEnum = { type: 'string', enum: ['IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'] };
const focusBlockTypeEnum = { type: 'string', enum: ['FOCUS', 'SHORT_BREAK', 'LONG_BREAK'] };
const algorithmTypeEnum = { type: 'string', enum: ['FSRS', 'SM2', 'LEITNER'] };
const progressTypeEnum = { type: 'string', enum: ['BOOK_PAGE', 'COURSE_LESSON', 'TOPIC_STUDY', 'REVIEW_SESSION'] };
const retentionLevelEnum = { type: 'string', enum: ['NEW', 'LEARNING', 'FAMILIAR', 'CONFIDENT', 'MASTERED'] };

// ==================== SETTINGS ====================
const updateSettingsBody = {
    type: 'object',
    properties: {
        daily_study_goal_minutes: { type: 'integer', minimum: 1, maximum: 1440 },
        weekly_study_goal_hours: { type: 'number', minimum: 0.5, maximum: 168 },
        preferred_algorithm: algorithmTypeEnum,
        show_streak_notifications: { type: 'boolean' },
        auto_schedule_reviews: { type: 'boolean' },
        review_reminder_time: { type: 'string', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' },
        theme_color: { type: 'string', maxLength: 20 }
    },
    additionalProperties: false
};

// ==================== COURSES (FORMAL EDUCATION) ====================
const createCourseBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        institution: { type: 'string', maxLength: 200, nullable: true },
        degree_type: { type: 'string', maxLength: 100, nullable: true },
        start_date: { type: 'string', format: 'date', nullable: true },
        expected_end_date: { type: 'string', format: 'date', nullable: true },
        status: courseStatusEnum,
        color: { type: 'string', maxLength: 20, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true }
    },
    required: ['name'],
    additionalProperties: false
};

const updateCourseBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        institution: { type: 'string', maxLength: 200, nullable: true },
        degree_type: { type: 'string', maxLength: 100, nullable: true },
        start_date: { type: 'string', format: 'date', nullable: true },
        expected_end_date: { type: 'string', format: 'date', nullable: true },
        actual_end_date: { type: 'string', format: 'date', nullable: true },
        status: courseStatusEnum,
        color: { type: 'string', maxLength: 20, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true }
    },
    additionalProperties: false
};

// ==================== PERIODS ====================
const createPeriodBody = {
    type: 'object',
    properties: {
        course_id: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 1, maxLength: 100 },
        start_date: { type: 'string', format: 'date', nullable: true },
        end_date: { type: 'string', format: 'date', nullable: true },
        status: periodStatusEnum,
        order_index: { type: 'integer', minimum: 0 }
    },
    required: ['course_id', 'name'],
    additionalProperties: false
};

const updatePeriodBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        start_date: { type: 'string', format: 'date', nullable: true },
        end_date: { type: 'string', format: 'date', nullable: true },
        status: periodStatusEnum,
        order_index: { type: 'integer', minimum: 0 }
    },
    additionalProperties: false
};

// ==================== SUBJECTS ====================
const createSubjectBody = {
    type: 'object',
    properties: {
        period_id: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 1, maxLength: 200 },
        code: { type: 'string', maxLength: 20, nullable: true },
        professor: { type: 'string', maxLength: 200, nullable: true },
        credits: { type: 'number', minimum: 0, nullable: true },
        color: { type: 'string', maxLength: 20, nullable: true },
        target_grade: { type: 'number', minimum: 0, maximum: 10, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true }
    },
    required: ['period_id', 'name'],
    additionalProperties: false
};

const updateSubjectBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        code: { type: 'string', maxLength: 20, nullable: true },
        professor: { type: 'string', maxLength: 200, nullable: true },
        credits: { type: 'number', minimum: 0, nullable: true },
        color: { type: 'string', maxLength: 20, nullable: true },
        target_grade: { type: 'number', minimum: 0, maximum: 10, nullable: true },
        current_grade: { type: 'number', minimum: 0, maximum: 10, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true }
    },
    additionalProperties: false
};

// ==================== SUBJECT WEIGHTS ====================
const createSubjectWeightBody = {
    type: 'object',
    properties: {
        subject_id: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 1, maxLength: 100 },
        weight_percent: { type: 'number', minimum: 0, maximum: 100 }
    },
    required: ['subject_id', 'name', 'weight_percent'],
    additionalProperties: false
};

const updateSubjectWeightBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        weight_percent: { type: 'number', minimum: 0, maximum: 100 }
    },
    additionalProperties: false
};

// ==================== EVALUATIONS ====================
const createEvaluationBody = {
    type: 'object',
    properties: {
        subject_id: { type: 'string', format: 'uuid' },
        weight_id: { type: 'string', format: 'uuid', nullable: true },
        name: { type: 'string', minLength: 1, maxLength: 200 },
        evaluation_type: evaluationTypeEnum,
        scheduled_date: { type: 'string', format: 'date', nullable: true },
        max_score: { type: 'number', minimum: 0, default: 10 },
        weight_override: { type: 'number', minimum: 0, maximum: 100, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true },
        topic_ids: { type: 'array', items: { type: 'string', format: 'uuid' }, default: [] }
    },
    required: ['subject_id', 'name', 'evaluation_type'],
    additionalProperties: false
};

const updateEvaluationBody = {
    type: 'object',
    properties: {
        weight_id: { type: 'string', format: 'uuid', nullable: true },
        name: { type: 'string', minLength: 1, maxLength: 200 },
        evaluation_type: evaluationTypeEnum,
        scheduled_date: { type: 'string', format: 'date', nullable: true },
        actual_date: { type: 'string', format: 'date', nullable: true },
        max_score: { type: 'number', minimum: 0 },
        obtained_score: { type: 'number', minimum: 0, nullable: true },
        weight_override: { type: 'number', minimum: 0, maximum: 100, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true },
        topic_ids: { type: 'array', items: { type: 'string', format: 'uuid' } }
    },
    additionalProperties: false
};

// ==================== EVALUATION FEEDBACK ====================
const createEvaluationFeedbackBody = {
    type: 'object',
    properties: {
        evaluation_id: { type: 'string', format: 'uuid' },
        what_went_well: { type: 'string', maxLength: 2000, nullable: true },
        what_to_improve: { type: 'string', maxLength: 2000, nullable: true },
        difficulty_rating: { type: 'integer', minimum: 1, maximum: 5, nullable: true },
        time_spent_minutes: { type: 'integer', minimum: 0, nullable: true },
        study_effectiveness: { type: 'integer', minimum: 1, maximum: 5, nullable: true }
    },
    required: ['evaluation_id'],
    additionalProperties: false
};

const updateEvaluationFeedbackBody = {
    type: 'object',
    properties: {
        what_went_well: { type: 'string', maxLength: 2000, nullable: true },
        what_to_improve: { type: 'string', maxLength: 2000, nullable: true },
        difficulty_rating: { type: 'integer', minimum: 1, maximum: 5, nullable: true },
        time_spent_minutes: { type: 'integer', minimum: 0, nullable: true },
        study_effectiveness: { type: 'integer', minimum: 1, maximum: 5, nullable: true }
    },
    additionalProperties: false
};

// ==================== BOOKS ====================
const createBookBody = {
    type: 'object',
    properties: {
        title: { type: 'string', minLength: 1, maxLength: 300 },
        author: { type: 'string', maxLength: 200, nullable: true },
        isbn: { type: 'string', maxLength: 20, nullable: true },
        cover_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        total_pages: { type: 'integer', minimum: 0, nullable: true },
        current_page: { type: 'integer', minimum: 0 },
        format: bookFormatEnum,
        has_audiobook: { type: 'boolean' },
        status: bookStatusEnum,
        category: { type: 'string', maxLength: 100, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true },
        started_at: { type: 'string', format: 'date', nullable: true }
    },
    required: ['title'],
    additionalProperties: false
};

const updateBookBody = {
    type: 'object',
    properties: {
        title: { type: 'string', minLength: 1, maxLength: 300 },
        author: { type: 'string', maxLength: 200, nullable: true },
        isbn: { type: 'string', maxLength: 20, nullable: true },
        cover_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        total_pages: { type: 'integer', minimum: 0, nullable: true },
        current_page: { type: 'integer', minimum: 0 },
        format: bookFormatEnum,
        has_audiobook: { type: 'boolean' },
        status: bookStatusEnum,
        category: { type: 'string', maxLength: 100, nullable: true },
        rating: { type: 'integer', minimum: 1, maximum: 5, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true },
        started_at: { type: 'string', format: 'date', nullable: true },
        finished_at: { type: 'string', format: 'date', nullable: true }
    },
    additionalProperties: false
};

// ==================== ONLINE COURSES ====================
const courseOnlineCategoryEnum = { type: 'string', enum: ['EXTRACURRICULAR', 'CERTIFICATION', 'EXTENSION', 'FREE'] };
const courseOnlineModalityEnum = { type: 'string', enum: ['ONLINE', 'IN_PERSON', 'HYBRID'] };

const createCourseOnlineBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 500 },
        platform: { type: 'string', maxLength: 100, nullable: true },
        instructor: { type: 'string', maxLength: 200, nullable: true },
        url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        cover_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        modality: courseOnlineModalityEnum,
        category: courseOnlineCategoryEnum,
        total_lessons: { type: 'integer', minimum: 1, nullable: true },
        total_hours: { type: 'number', minimum: 0, nullable: true },
        status: courseOnlineStatusEnum,
        notes: { type: 'string', maxLength: 5000, nullable: true }
    },
    required: ['name'],
    additionalProperties: false
};

const updateCourseOnlineBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 500 },
        platform: { type: 'string', maxLength: 100, nullable: true },
        instructor: { type: 'string', maxLength: 200, nullable: true },
        url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        cover_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        modality: courseOnlineModalityEnum,
        category: courseOnlineCategoryEnum,
        total_lessons: { type: 'integer', minimum: 1, nullable: true },
        current_lesson: { type: 'integer', minimum: 0 },
        total_hours: { type: 'number', minimum: 0, nullable: true },
        status: courseOnlineStatusEnum,
        certificate_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        rating: { type: 'integer', minimum: 1, maximum: 5, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true },
        started_at: { type: 'string', format: 'date', nullable: true },
        finished_at: { type: 'string', format: 'date', nullable: true }
    },
    additionalProperties: false
};

// ==================== TOPICS ====================
const createTopicBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 2000, nullable: true },
        source_type: topicSourceTypeEnum,
        source_id: { type: 'string', format: 'uuid', nullable: true },
        parent_topic_id: { type: 'string', format: 'uuid', nullable: true },
        status: topicStatusEnum,
        order_index: { type: 'integer', minimum: 0, default: 0 }
    },
    required: ['name', 'source_type'],
    additionalProperties: false
};

const updateTopicBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 2000, nullable: true },
        parent_topic_id: { type: 'string', format: 'uuid', nullable: true },
        status: topicStatusEnum,
        retention_level: retentionLevelEnum,
        last_reviewed_at: { type: 'string', format: 'date-time', nullable: true },
        order_index: { type: 'integer', minimum: 0 }
    },
    additionalProperties: false
};

// ==================== PROGRESS LOGS ====================
const createProgressLogBody = {
    type: 'object',
    properties: {
        progress_type: progressTypeEnum,
        reference_id: { type: 'string', format: 'uuid' },
        value: { type: 'integer', minimum: 0 },
        notes: { type: 'string', maxLength: 1000, nullable: true }
    },
    required: ['progress_type', 'reference_id', 'value'],
    additionalProperties: false
};

// ==================== RETENTION LOGS ====================
const createRetentionLogBody = {
    type: 'object',
    properties: {
        topic_id: { type: 'string', format: 'uuid' },
        retention_level: retentionLevelEnum,
        confidence_score: { type: 'integer', minimum: 0, maximum: 100, nullable: true }
    },
    required: ['topic_id', 'retention_level'],
    additionalProperties: false
};

// ==================== DECKS ====================
const createDeckBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 1000, nullable: true },
        topic_id: { type: 'string', format: 'uuid', nullable: true },
        subject_id: { type: 'string', format: 'uuid', nullable: true },
        color: { type: 'string', maxLength: 20, nullable: true },
        is_public: { type: 'boolean', default: false }
    },
    required: ['name'],
    additionalProperties: false
};

const updateDeckBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 1000, nullable: true },
        topic_id: { type: 'string', format: 'uuid', nullable: true },
        subject_id: { type: 'string', format: 'uuid', nullable: true },
        color: { type: 'string', maxLength: 20, nullable: true },
        is_public: { type: 'boolean' }
    },
    additionalProperties: false
};

// ==================== FLASHCARDS ====================
const createFlashcardBody = {
    type: 'object',
    properties: {
        deck_id: { type: 'string', format: 'uuid' },
        front_content: { type: 'string', minLength: 1, maxLength: 5000 },
        back_content: { type: 'string', minLength: 1, maxLength: 5000 },
        front_image_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        back_image_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        tags: { type: 'array', items: { type: 'string', maxLength: 50 }, default: [] }
    },
    required: ['deck_id', 'front_content', 'back_content'],
    additionalProperties: false
};

const updateFlashcardBody = {
    type: 'object',
    properties: {
        front_content: { type: 'string', minLength: 1, maxLength: 5000 },
        back_content: { type: 'string', minLength: 1, maxLength: 5000 },
        front_image_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        back_image_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        tags: { type: 'array', items: { type: 'string', maxLength: 50 } },
        is_suspended: { type: 'boolean' }
    },
    additionalProperties: false
};

// ==================== REVIEW SESSIONS ====================
const createReviewSessionBody = {
    type: 'object',
    properties: {
        deck_id: { type: 'string', format: 'uuid', nullable: true },
        topic_id: { type: 'string', format: 'uuid', nullable: true }
    },
    additionalProperties: false
};

const completeReviewSessionBody = {
    type: 'object',
    properties: {
        cards_reviewed: { type: 'integer', minimum: 0 },
        cards_correct: { type: 'integer', minimum: 0 },
        cards_again: { type: 'integer', minimum: 0 }
    },
    required: ['cards_reviewed'],
    additionalProperties: false
};

// ==================== REVIEW LOGS ====================
const createReviewLogBody = {
    type: 'object',
    properties: {
        session_id: { type: 'string', format: 'uuid' },
        flashcard_id: { type: 'string', format: 'uuid' },
        rating: reviewRatingEnum,
        time_taken_ms: { type: 'integer', minimum: 0, nullable: true }
    },
    required: ['session_id', 'flashcard_id', 'rating'],
    additionalProperties: false
};

// ==================== PROJECTS ====================
const createProjectBody = {
    type: 'object',
    properties: {
        template_id: { type: 'string', format: 'uuid', nullable: true },
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 2000, nullable: true },
        goal: { type: 'string', maxLength: 500, nullable: true },
        status: projectStatusEnum,
        target_date: { type: 'string', format: 'date', nullable: true },
        color: { type: 'string', maxLength: 20, nullable: true }
    },
    required: ['name'],
    additionalProperties: false
};

const updateProjectBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 2000, nullable: true },
        goal: { type: 'string', maxLength: 500, nullable: true },
        status: projectStatusEnum,
        target_date: { type: 'string', format: 'date', nullable: true },
        completed_at: { type: 'string', format: 'date-time', nullable: true },
        color: { type: 'string', maxLength: 20, nullable: true }
    },
    additionalProperties: false
};

// ==================== PROJECT RESOURCES ====================
const createProjectResourceBody = {
    type: 'object',
    properties: {
        project_id: { type: 'string', format: 'uuid' },
        resource_type: resourceTypeEnum,
        resource_id: { type: 'string', format: 'uuid' },
        order_index: { type: 'integer', minimum: 0, default: 0 }
    },
    required: ['project_id', 'resource_type', 'resource_id'],
    additionalProperties: false
};

const updateProjectResourceBody = {
    type: 'object',
    properties: {
        order_index: { type: 'integer', minimum: 0 }
    },
    additionalProperties: false
};

// ==================== PROJECT MILESTONES ====================
const createMilestoneBody = {
    type: 'object',
    properties: {
        project_id: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 1000, nullable: true },
        target_date: { type: 'string', format: 'date', nullable: true },
        order_index: { type: 'integer', minimum: 0, default: 0 }
    },
    required: ['project_id', 'name'],
    additionalProperties: false
};

const updateMilestoneBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 1000, nullable: true },
        target_date: { type: 'string', format: 'date', nullable: true },
        completed_at: { type: 'string', format: 'date-time', nullable: true },
        order_index: { type: 'integer', minimum: 0 }
    },
    additionalProperties: false
};

// ==================== FOCUS MODE ====================
const createFocusSessionBody = {
    type: 'object',
    properties: {
        preset_id: { type: 'string', format: 'uuid', nullable: true },
        topic_id: { type: 'string', format: 'uuid', nullable: true },
        subject_id: { type: 'string', format: 'uuid', nullable: true },
        custom_block_minutes: { type: 'integer', minimum: 1, maximum: 180, nullable: true },
        custom_break_minutes: { type: 'integer', minimum: 1, maximum: 60, nullable: true },
        planned_blocks: { type: 'integer', minimum: 1, maximum: 20, nullable: true },
        notes: { type: 'string', maxLength: 1000, nullable: true }
    },
    additionalProperties: false
};

const updateFocusSessionBody = {
    type: 'object',
    properties: {
        status: focusSessionStatusEnum,
        completed_blocks: { type: 'integer', minimum: 0 },
        total_focus_minutes: { type: 'integer', minimum: 0 },
        total_break_minutes: { type: 'integer', minimum: 0 },
        skipped_breaks: { type: 'integer', minimum: 0 },
        notes: { type: 'string', maxLength: 1000, nullable: true }
    },
    additionalProperties: false
};

const createFocusBlockBody = {
    type: 'object',
    properties: {
        session_id: { type: 'string', format: 'uuid' },
        block_type: focusBlockTypeEnum,
        planned_minutes: { type: 'integer', minimum: 1, maximum: 180 },
        block_number: { type: 'integer', minimum: 1 }
    },
    required: ['session_id', 'block_type', 'planned_minutes', 'block_number'],
    additionalProperties: false
};

const updateFocusBlockBody = {
    type: 'object',
    properties: {
        actual_minutes: { type: 'integer', minimum: 0 },
        was_skipped: { type: 'boolean' },
        ended_at: { type: 'string', format: 'date-time' }
    },
    additionalProperties: false
};

// ==================== LEGACY SCHEMAS ====================
// Library Shelf schemas (legacy, kept for compatibility)
const createLibraryShelfBody = {
    type: 'object',
    properties: {
        title: { type: 'string', minLength: 1, maxLength: 300 },
        author: { type: 'string', maxLength: 200, nullable: true },
        item_type: itemTypeEnum,
        shelf_type: shelfTypeEnum,
        cover_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        total_pages: { type: 'integer', minimum: 1, nullable: true },
        current_page: { type: 'integer', minimum: 0, default: 0 },
        rating: { type: 'integer', minimum: 1, maximum: 5, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true },
        tags: { type: 'array', items: { type: 'string' }, default: [] }
    },
    required: ['title', 'item_type', 'shelf_type'],
    additionalProperties: false
};

const updateLibraryShelfBody = {
    type: 'object',
    properties: {
        title: { type: 'string', minLength: 1, maxLength: 300 },
        author: { type: 'string', maxLength: 200, nullable: true },
        item_type: itemTypeEnum,
        shelf_type: shelfTypeEnum,
        cover_url: { type: 'string', format: 'uri', maxLength: 500, nullable: true },
        total_pages: { type: 'integer', minimum: 1, nullable: true },
        current_page: { type: 'integer', minimum: 0 },
        rating: { type: 'integer', minimum: 1, maximum: 5, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true },
        tags: { type: 'array', items: { type: 'string' } }
    },
    additionalProperties: false
};

// Study Session schemas (legacy)
const createStudySessionBody = {
    type: 'object',
    properties: {
        subject: { type: 'string', minLength: 1, maxLength: 200 },
        start_time: { type: 'string', format: 'date-time' },
        end_time: { type: 'string', format: 'date-time', nullable: true },
        duration_minutes: { type: 'integer', minimum: 1, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true },
        tags: { type: 'array', items: { type: 'string' }, default: [] }
    },
    required: ['subject', 'start_time'],
    additionalProperties: false
};

const updateStudySessionBody = {
    type: 'object',
    properties: {
        subject: { type: 'string', minLength: 1, maxLength: 200 },
        start_time: { type: 'string', format: 'date-time' },
        end_time: { type: 'string', format: 'date-time', nullable: true },
        duration_minutes: { type: 'integer', minimum: 1, nullable: true },
        notes: { type: 'string', maxLength: 5000, nullable: true },
        tags: { type: 'array', items: { type: 'string' } }
    },
    additionalProperties: false
};

// Spaced Review schemas (legacy)
const createSpacedReviewBody = {
    type: 'object',
    properties: {
        topic: { type: 'string', minLength: 1, maxLength: 300 },
        content: { type: 'string', maxLength: 10000, nullable: true },
        next_review_date: { type: 'string', format: 'date' },
        last_review_date: { type: 'string', format: 'date', nullable: true },
        difficulty: reviewDifficultyEnum,
        review_count: { type: 'integer', minimum: 0, default: 0 },
        tags: { type: 'array', items: { type: 'string' }, default: [] }
    },
    required: ['topic', 'next_review_date'],
    additionalProperties: false
};

const updateSpacedReviewBody = {
    type: 'object',
    properties: {
        topic: { type: 'string', minLength: 1, maxLength: 300 },
        content: { type: 'string', maxLength: 10000, nullable: true },
        next_review_date: { type: 'string', format: 'date' },
        last_review_date: { type: 'string', format: 'date', nullable: true },
        difficulty: reviewDifficultyEnum,
        review_count: { type: 'integer', minimum: 0 },
        tags: { type: 'array', items: { type: 'string' } }
    },
    additionalProperties: false
};

// Note schemas (legacy)
const createNoteBody = {
    type: 'object',
    properties: {
        title: { type: 'string', minLength: 1, maxLength: 300 },
        content: { type: 'string', maxLength: 50000 },
        category: { type: 'string', maxLength: 100, nullable: true },
        tags: { type: 'array', items: { type: 'string' }, default: [] },
        is_pinned: { type: 'boolean', default: false }
    },
    required: ['title', 'content'],
    additionalProperties: false
};

const updateNoteBody = {
    type: 'object',
    properties: {
        title: { type: 'string', minLength: 1, maxLength: 300 },
        content: { type: 'string', maxLength: 50000 },
        category: { type: 'string', maxLength: 100, nullable: true },
        tags: { type: 'array', items: { type: 'string' } },
        is_pinned: { type: 'boolean' }
    },
    additionalProperties: false
};

module.exports = {
    // Enums
    shelfTypeEnum,
    itemTypeEnum,
    reviewDifficultyEnum,
    courseStatusEnum,
    periodStatusEnum,
    bookStatusEnum,
    bookFormatEnum,
    courseOnlineStatusEnum,
    topicStatusEnum,
    topicSourceTypeEnum,
    evaluationTypeEnum,
    flashcardDifficultyEnum,
    reviewRatingEnum,
    projectStatusEnum,
    resourceTypeEnum,
    focusSessionStatusEnum,
    focusBlockTypeEnum,
    algorithmTypeEnum,
    progressTypeEnum,
    retentionLevelEnum,

    // Settings
    updateSettingsBody,

    // Courses
    createCourseBody,
    updateCourseBody,

    // Periods
    createPeriodBody,
    updatePeriodBody,

    // Subjects
    createSubjectBody,
    updateSubjectBody,

    // Subject Weights
    createSubjectWeightBody,
    updateSubjectWeightBody,

    // Evaluations
    createEvaluationBody,
    updateEvaluationBody,

    // Evaluation Feedback
    createEvaluationFeedbackBody,
    updateEvaluationFeedbackBody,

    // Books
    createBookBody,
    updateBookBody,

    // Online Courses
    createCourseOnlineBody,
    updateCourseOnlineBody,

    // Topics
    createTopicBody,
    updateTopicBody,

    // Progress Logs
    createProgressLogBody,

    // Retention Logs
    createRetentionLogBody,

    // Decks
    createDeckBody,
    updateDeckBody,

    // Flashcards
    createFlashcardBody,
    updateFlashcardBody,

    // Review Sessions
    createReviewSessionBody,
    completeReviewSessionBody,

    // Review Logs
    createReviewLogBody,

    // Projects
    createProjectBody,
    updateProjectBody,

    // Project Resources
    createProjectResourceBody,
    updateProjectResourceBody,

    // Milestones
    createMilestoneBody,
    updateMilestoneBody,

    // Focus Mode
    createFocusSessionBody,
    updateFocusSessionBody,
    createFocusBlockBody,
    updateFocusBlockBody,

    // Legacy schemas
    createLibraryShelfBody,
    updateLibraryShelfBody,
    createStudySessionBody,
    updateStudySessionBody,
    createSpacedReviewBody,
    updateSpacedReviewBody,
    createNoteBody,
    updateNoteBody
};
