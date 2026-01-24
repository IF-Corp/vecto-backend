// Project and Task schemas

const projectStatusEnum = { type: 'string', enum: ['IN_PROGRESS', 'COMPLETED', 'PAUSED'] };
const taskStatusEnum = { type: 'string', enum: ['BACKLOG', 'TODO', 'DOING', 'DONE'] };
const taskPriorityEnum = { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] };

// Project schemas
const createProjectBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        deadline: { type: 'string', format: 'date-time', nullable: true },
        status: projectStatusEnum,
        life_area: { type: 'string', maxLength: 100, nullable: true }
    },
    required: ['name'],
    additionalProperties: false
};

const updateProjectBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 200 },
        deadline: { type: 'string', format: 'date-time', nullable: true },
        status: projectStatusEnum,
        life_area: { type: 'string', maxLength: 100, nullable: true }
    },
    additionalProperties: false
};

// Task schemas
const createTaskBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 500 },
        description: { type: 'string', maxLength: 5000, nullable: true },
        project_id: { type: 'string', format: 'uuid', nullable: true },
        status: taskStatusEnum,
        priority: taskPriorityEnum,
        scheduled_date: { type: 'string', format: 'date', nullable: true },
        scheduled_time: { type: 'string', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$', nullable: true },
        estimated_duration: { type: 'integer', minimum: 0, nullable: true },
        category_name: { type: 'string', maxLength: 100, nullable: true },
        tags: { type: 'array', items: { type: 'string' }, default: [] },
        assignees: { type: 'array', items: { type: 'string', format: 'uuid' }, default: [] }
    },
    required: ['name'],
    additionalProperties: false
};

const updateTaskBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 500 },
        description: { type: 'string', maxLength: 5000, nullable: true },
        project_id: { type: 'string', format: 'uuid', nullable: true },
        status: taskStatusEnum,
        priority: taskPriorityEnum,
        scheduled_date: { type: 'string', format: 'date', nullable: true },
        scheduled_time: { type: 'string', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$', nullable: true },
        estimated_duration: { type: 'integer', minimum: 0, nullable: true },
        category_name: { type: 'string', maxLength: 100, nullable: true },
        tags: { type: 'array', items: { type: 'string' } },
        assignees: { type: 'array', items: { type: 'string', format: 'uuid' } }
    },
    additionalProperties: false
};

// Meeting schemas
const createMeetingBody = {
    type: 'object',
    properties: {
        project_id: { type: 'string', format: 'uuid' },
        meeting_date: { type: 'string', format: 'date-time' },
        summary: { type: 'string', maxLength: 5000, nullable: true },
        action_items: { type: 'array', items: { type: 'string' }, default: [] }
    },
    required: ['project_id', 'meeting_date'],
    additionalProperties: false
};

const updateMeetingBody = {
    type: 'object',
    properties: {
        meeting_date: { type: 'string', format: 'date-time' },
        summary: { type: 'string', maxLength: 5000, nullable: true },
        action_items: { type: 'array', items: { type: 'string' } }
    },
    additionalProperties: false
};

module.exports = {
    createProjectBody,
    updateProjectBody,
    createTaskBody,
    updateTaskBody,
    createMeetingBody,
    updateMeetingBody,
    projectStatusEnum,
    taskStatusEnum,
    taskPriorityEnum
};
