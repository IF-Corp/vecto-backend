const habitController = require('../controllers/habitController');
const { habit, common } = require('../schemas');

async function habitRoutes(fastify, options) {
    // Apply authentication to all routes
    fastify.addHook('preHandler', fastify.authenticate);

    // ==================== HABITS ====================
    fastify.get('/users/:userId/habits', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all habits for a user',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, habitController.getHabits);

    fastify.post('/users/:userId/habits', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new habit',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: habit.createHabitBody
        }
    }, habitController.createHabit);

    fastify.put('/habits/:id', {
        schema: {
            description: 'Update a habit',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: habit.updateHabitBody
        }
    }, habitController.updateHabit);

    fastify.delete('/habits/:id', {
        schema: {
            description: 'Delete a habit',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, habitController.deleteHabit);

    fastify.post('/habits/:id/log', {
        schema: {
            description: 'Log habit completion',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: habit.logHabitBody
        }
    }, habitController.logHabit);

    // ==================== ROUTINES ====================
    fastify.get('/users/:userId/routines', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get all routines for a user',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, habitController.getRoutines);

    fastify.post('/users/:userId/routines', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new routine',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: habit.createRoutineBody
        }
    }, habitController.createRoutine);

    fastify.put('/routines/:id', {
        schema: {
            description: 'Update a routine',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: habit.updateRoutineBody
        }
    }, habitController.updateRoutine);

    fastify.delete('/routines/:id', {
        schema: {
            description: 'Delete a routine',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, habitController.deleteRoutine);

    // ==================== SOCIAL GROUPS ====================
    fastify.get('/social-groups', {
        schema: {
            description: 'Get all social groups',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }]
        }
    }, habitController.getSocialGroups);

    fastify.post('/social-groups', {
        schema: {
            description: 'Create a social group',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            body: habit.createSocialGroupBody
        }
    }, habitController.createSocialGroup);

    fastify.post('/social-groups/:id/join', {
        schema: {
            description: 'Join a social group',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: habit.joinGroupBody
        }
    }, habitController.joinGroup);

    fastify.post('/social-groups/:id/leave', {
        schema: {
            description: 'Leave a social group',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: habit.joinGroupBody
        }
    }, habitController.leaveGroup);

    fastify.get('/social-groups/:id/ranking', {
        schema: {
            description: 'Get group ranking',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, habitController.getGroupRanking);
}

module.exports = habitRoutes;
