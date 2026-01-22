const userController = require('../controllers/userController');

async function userRoutes(fastify, options) {
    // Get user by ID
    fastify.get('/users/:id', userController.getUser);

    // Get user by email (query parameter)
    fastify.get('/users', userController.getUserByEmail);

    // Create or update user (upsert) - to be called after Firebase auth
    fastify.post('/users', userController.upsertUser);

    // Update user onboarding status
    fastify.patch('/users/:id/onboarding', userController.updateOnboardingStatus);

    // Update user profile
    fastify.put('/users/:id', userController.updateUser);
}

module.exports = userRoutes;
