const { uuidPattern } = require('./common');

const profileTypeEnum = ['ADULT', 'TEENAGER', 'CHILD', 'ELDERLY', 'NO_PARTICIPATION'];

const spaceIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId'],
};

const memberIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        spaceId: { type: 'string', pattern: uuidPattern },
        id: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'spaceId', 'id'],
};

const createMemberBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        profile: { type: 'string', enum: profileTypeEnum },
        avatar_url: { type: 'string', maxLength: 500 },
        email: { type: 'string', format: 'email', maxLength: 255 },
        phone: { type: 'string', maxLength: 20 },
        birth_date: { type: 'string', format: 'date' },
    },
    required: ['name'],
};

const updateMemberBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        profile: { type: 'string', enum: profileTypeEnum },
        avatar_url: { type: 'string', maxLength: 500 },
        email: { type: 'string', format: 'email', maxLength: 255 },
        phone: { type: 'string', maxLength: 20 },
        birth_date: { type: 'string', format: 'date' },
        is_active: { type: 'boolean' },
    },
};

module.exports = {
    profileTypeEnum,
    spaceIdParams,
    memberIdParams,
    createMemberBody,
    updateMemberBody,
};
