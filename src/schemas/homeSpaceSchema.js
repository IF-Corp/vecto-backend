const { uuidPattern } = require('./common');

const spaceTypeEnum = ['HOUSE', 'APARTMENT', 'STUDIO', 'ROOM', 'OTHER'];
const moduleTypeEnum = ['ROUTINE', 'MAINTENANCE', 'SHOPPING', 'STOCK', 'PLANTS', 'PETS', 'MEALS', 'PROJECTS'];

const spaceIdParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        id: { type: 'string', pattern: uuidPattern },
    },
    required: ['userId', 'id'],
};

const spaceModuleParams = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: uuidPattern },
        id: { type: 'string', pattern: uuidPattern },
        moduleType: { type: 'string', enum: moduleTypeEnum },
    },
    required: ['userId', 'id', 'moduleType'],
};

const createSpaceBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        type: { type: 'string', enum: spaceTypeEnum },
        address: { type: 'string', maxLength: 255 },
        enabledModules: {
            type: 'array',
            items: { type: 'string', enum: moduleTypeEnum },
        },
    },
    required: ['name'],
};

const updateSpaceBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        type: { type: 'string', enum: spaceTypeEnum },
        address: { type: 'string', maxLength: 255 },
        is_active: { type: 'boolean' },
    },
};

const updateSpaceModulesBody = {
    type: 'object',
    properties: {
        modules: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    module_type: { type: 'string', enum: moduleTypeEnum },
                    is_enabled: { type: 'boolean' },
                    settings: { type: 'object' },
                },
                required: ['module_type'],
            },
        },
    },
    required: ['modules'],
};

const toggleModuleBody = {
    type: 'object',
    properties: {
        is_enabled: { type: 'boolean' },
    },
    required: ['is_enabled'],
};

module.exports = {
    spaceTypeEnum,
    moduleTypeEnum,
    spaceIdParams,
    spaceModuleParams,
    createSpaceBody,
    updateSpaceBody,
    updateSpaceModulesBody,
    toggleModuleBody,
};
