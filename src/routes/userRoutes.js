const userController = require('../controllers/userController');
const { user, common } = require('../schemas');

async function userRoutes(fastify, options) {
    // Get user by ID
    fastify.get('/users/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Get user by ID',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            response: {
                200: user.userResponse,
                404: common.errorResponse
            }
        }
    }, userController.getUser);

    // Get user by email (query parameter)
    fastify.get('/users', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Get user by email',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' }
                },
                required: ['email']
            },
            response: {
                200: user.userResponse,
                404: common.errorResponse
            }
        }
    }, userController.getUserByEmail);

    // Create or update user (upsert)
    fastify.post('/users', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Create or update user',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            body: user.createUserBody,
            response: {
                200: user.userResponse,
                201: user.userResponse
            }
        }
    }, userController.upsertUser);

    // Update user onboarding status
    fastify.patch('/users/:id/onboarding', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Update user onboarding status',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: user.updateOnboardingBody,
            response: {
                200: user.userResponse,
                404: common.errorResponse
            }
        }
    }, userController.updateOnboardingStatus);

    // Update user profile
    fastify.put('/users/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Update user profile',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: user.updateUserBody,
            response: {
                200: user.userResponse,
                404: common.errorResponse
            }
        }
    }, userController.updateUser);
}

module.exports = userRoutes;
