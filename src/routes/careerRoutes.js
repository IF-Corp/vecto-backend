const careerController = require('../controllers/careerController');
const { common } = require('../schemas');

async function careerRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== SKILLS ====================
    fastify.get('/users/:userId/work/skills', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all skills for a user',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    category: { type: 'string' },
                },
            },
        },
    }, careerController.getSkills);

    fastify.get('/work/skills/:id', {
        schema: {
            description: 'Get a specific skill',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, careerController.getSkill);

    fastify.post('/users/:userId/work/skills', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a skill',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, careerController.createSkill);

    fastify.put('/work/skills/:id', {
        schema: {
            description: 'Update a skill',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, careerController.updateSkill);

    fastify.delete('/work/skills/:id', {
        schema: {
            description: 'Delete a skill',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, careerController.deleteSkill);

    // ==================== SKILL EVIDENCES ====================
    fastify.post('/work/skills/:skillId/evidences', {
        schema: {
            description: 'Add an evidence to a skill',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
        },
    }, careerController.addSkillEvidence);

    fastify.delete('/work/skill-evidences/:id', {
        schema: {
            description: 'Delete a skill evidence',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, careerController.deleteSkillEvidence);

    // ==================== CERTIFICATIONS ====================
    fastify.get('/users/:userId/work/certifications', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all certifications for a user',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    expired: { type: 'string', enum: ['true', 'false'] },
                },
            },
        },
    }, careerController.getCertifications);

    fastify.get('/work/certifications/:id', {
        schema: {
            description: 'Get a specific certification',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, careerController.getCertification);

    fastify.post('/users/:userId/work/certifications', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a certification',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, careerController.createCertification);

    fastify.put('/work/certifications/:id', {
        schema: {
            description: 'Update a certification',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, careerController.updateCertification);

    fastify.delete('/work/certifications/:id', {
        schema: {
            description: 'Delete a certification',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, careerController.deleteCertification);

    // ==================== ACHIEVEMENTS ====================
    fastify.get('/users/:userId/work/achievements', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all achievements for a user',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, careerController.getAchievements);

    fastify.get('/work/achievements/:id', {
        schema: {
            description: 'Get a specific achievement',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, careerController.getAchievement);

    fastify.post('/users/:userId/work/achievements', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create an achievement',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, careerController.createAchievement);

    fastify.put('/work/achievements/:id', {
        schema: {
            description: 'Update an achievement',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, careerController.updateAchievement);

    fastify.delete('/work/achievements/:id', {
        schema: {
            description: 'Delete an achievement',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
        },
    }, careerController.deleteAchievement);

    // ==================== CAREER TIMELINE ====================
    fastify.get('/users/:userId/work/career/timeline', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get career timeline',
            tags: ['Work - Career'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, careerController.getCareerTimeline);
}

module.exports = careerRoutes;
