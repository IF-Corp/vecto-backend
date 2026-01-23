// Common schemas for reuse across modules

const uuidPattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

const idParams = {
    type: 'object',
    properties: {
        id: { type: 'string', pattern: uuidPattern }
    },
    required: ['id']
};

const userIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern }
    },
    required: ['userId']
};

const userIdAndIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        id: { type: 'string', pattern: uuidPattern }
    },
    required: ['userId', 'id']
};

const paginationQuery = {
    type: 'object',
    properties: {
        page: { type: 'integer', minimum: 1, default: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
    }
};

const successResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean', const: true },
        data: {}
    },
    required: ['success']
};

const errorResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean', const: false },
        error: { type: 'string' },
        message: { type: 'string' },
        details: { type: 'array', items: { type: 'object' } }
    }
};

const timestamps = {
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
};

module.exports = {
    uuidPattern,
    idParams,
    userIdParams,
    userIdAndIdParams,
    paginationQuery,
    successResponse,
    errorResponse,
    timestamps
};
