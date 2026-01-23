// Study module schemas

const shelfTypeEnum = { type: 'string', enum: ['READING', 'WANT_TO_READ', 'FINISHED'] };
const itemTypeEnum = { type: 'string', enum: ['BOOK', 'ARTICLE', 'VIDEO', 'COURSE', 'OTHER'] };
const reviewDifficultyEnum = { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'] };

// Library Shelf schemas
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

// Study Session schemas
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

// Spaced Review schemas
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

// Note schemas
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
    createLibraryShelfBody,
    updateLibraryShelfBody,
    createStudySessionBody,
    updateStudySessionBody,
    createSpacedReviewBody,
    updateSpacedReviewBody,
    createNoteBody,
    updateNoteBody,
    shelfTypeEnum,
    itemTypeEnum,
    reviewDifficultyEnum
};
