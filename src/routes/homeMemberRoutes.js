const homeMemberController = require('../controllers/homeMemberController');
const { common } = require('../schemas');
const homeMemberSchema = require('../schemas/homeMemberSchema');

async function homeMemberRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== MEMBERS BY USER ====================

    fastify.get('/users/:userId/home/members', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all members across all spaces for a user',
            tags: ['Home - Members'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
        },
    }, homeMemberController.getMembersByUser);

    // ==================== MEMBERS BY SPACE ====================

    fastify.get('/users/:userId/home/spaces/:spaceId/members', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all members for a specific space',
            tags: ['Home - Members'],
            security: [{ bearerAuth: [] }],
            params: homeMemberSchema.spaceIdParams,
        },
    }, homeMemberController.getMembers);

    fastify.get('/users/:userId/home/spaces/:spaceId/members/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get a specific member',
            tags: ['Home - Members'],
            security: [{ bearerAuth: [] }],
            params: homeMemberSchema.memberIdParams,
        },
    }, homeMemberController.getMember);

    fastify.post('/users/:userId/home/spaces/:spaceId/members', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Add a new member to a space',
            tags: ['Home - Members'],
            security: [{ bearerAuth: [] }],
            params: homeMemberSchema.spaceIdParams,
            body: homeMemberSchema.createMemberBody,
        },
    }, homeMemberController.createMember);

    fastify.put('/users/:userId/home/spaces/:spaceId/members/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Update a member',
            tags: ['Home - Members'],
            security: [{ bearerAuth: [] }],
            params: homeMemberSchema.memberIdParams,
            body: homeMemberSchema.updateMemberBody,
        },
    }, homeMemberController.updateMember);

    fastify.delete('/users/:userId/home/spaces/:spaceId/members/:id', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Remove a member from a space',
            tags: ['Home - Members'],
            security: [{ bearerAuth: [] }],
            params: homeMemberSchema.memberIdParams,
        },
    }, homeMemberController.deleteMember);
}

module.exports = homeMemberRoutes;
