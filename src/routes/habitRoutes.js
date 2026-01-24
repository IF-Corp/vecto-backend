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
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['active', 'archived', 'all'], default: 'active' }
                }
            }
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

    fastify.post('/habits/:id/archive', {
        schema: {
            description: 'Archive a habit',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, habitController.archiveHabit);

    fastify.post('/habits/:id/reactivate', {
        schema: {
            description: 'Reactivate an archived habit',
            tags: ['Habits'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: habit.reactivateHabitBody
        }
    }, habitController.reactivateHabit);

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
            tags: ['Routines'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['active', 'archived', 'all'], default: 'active' }
                }
            }
        }
    }, habitController.getRoutines);

    fastify.post('/users/:userId/routines', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Create a new routine',
            tags: ['Routines'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            body: habit.createRoutineBody
        }
    }, habitController.createRoutine);

    fastify.put('/routines/:id', {
        schema: {
            description: 'Update a routine',
            tags: ['Routines'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: habit.updateRoutineBody
        }
    }, habitController.updateRoutine);

    fastify.delete('/routines/:id', {
        schema: {
            description: 'Delete a routine',
            tags: ['Routines'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, habitController.deleteRoutine);

    fastify.post('/routines/:id/archive', {
        schema: {
            description: 'Archive a routine',
            tags: ['Routines'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, habitController.archiveRoutine);

    fastify.post('/routines/:id/executions', {
        schema: {
            description: 'Log a routine execution (focus mode)',
            tags: ['Routines'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            body: habit.logRoutineExecutionBody
        }
    }, habitController.logRoutineExecution);

    fastify.get('/routines/:id/history', {
        schema: {
            description: 'Get routine execution history',
            tags: ['Routines'],
            security: [{ bearerAuth: [] }],
            params: common.idParams,
            querystring: {
                type: 'object',
                properties: {
                    limit: { type: 'integer', default: 30 }
                }
            }
        }
    }, habitController.getRoutineHistory);

    // ==================== FOCUS MODE ====================
    fastify.post('/routines/:id/executions/start', {
        schema: {
            description: 'Start a focus session for a routine',
            tags: ['Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.idParams
        }
    }, habitController.startFocusSession);

    fastify.put('/routines/:id/executions/:executionId/pause', {
        schema: {
            description: 'Pause an active focus session',
            tags: ['Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id', 'executionId'],
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    executionId: { type: 'string', format: 'uuid' }
                }
            }
        }
    }, habitController.pauseFocusSession);

    fastify.put('/routines/:id/executions/:executionId/resume', {
        schema: {
            description: 'Resume a paused focus session',
            tags: ['Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id', 'executionId'],
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    executionId: { type: 'string', format: 'uuid' }
                }
            }
        }
    }, habitController.resumeFocusSession);

    fastify.put('/routines/:id/executions/:executionId/complete', {
        schema: {
            description: 'Complete a focus session',
            tags: ['Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id', 'executionId'],
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    executionId: { type: 'string', format: 'uuid' }
                }
            },
            body: habit.completeFocusSessionBody
        }
    }, habitController.completeFocusSession);

    fastify.put('/routines/:id/executions/:executionId/cancel', {
        schema: {
            description: 'Cancel an active focus session',
            tags: ['Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id', 'executionId'],
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    executionId: { type: 'string', format: 'uuid' }
                }
            }
        }
    }, habitController.cancelFocusSession);

    fastify.get('/users/:userId/active-session', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get the active focus session for a user',
            tags: ['Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams
        }
    }, habitController.getActiveSession);

    fastify.get('/users/:userId/focus-stats', {
        preHandler: [fastify.authorizeUser],
        schema: {
            description: 'Get focus mode statistics for a user',
            tags: ['Focus Mode'],
            security: [{ bearerAuth: [] }],
            params: common.userIdParams,
            querystring: {
                type: 'object',
                properties: {
                    period: { type: 'string', enum: ['week', 'month', 'all'], default: 'week' }
                }
            }
        }
    }, habitController.getFocusStats);

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
