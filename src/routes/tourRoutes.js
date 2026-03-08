const tourController = require('../controllers/tourController');
const { common } = require('../schemas');

const tourStateResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'object',
            nullable: true,
            properties: {
                app_tour_completed: { type: 'boolean' },
                app_tour_current_step: { type: 'integer' },
                completed_page_tours: {
                    type: 'array',
                    nullable: true,
                    items: { type: 'string' },
                },
                skipped_tours: {
                    type: 'array',
                    nullable: true,
                    items: { type: 'string' },
                },
            },
        },
    },
};

async function tourRoutes(fastify, options) {
    fastify.get(
        '/users/me/tour-state',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Get current user tour state',
                tags: ['Tour'],
                security: [{ bearerAuth: [] }],
                response: {
                    200: tourStateResponse,
                    500: common.errorResponse,
                },
            },
        },
        tourController.getTourState,
    );

    fastify.put(
        '/users/me/tour-state',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Update tour state',
                tags: ['Tour'],
                security: [{ bearerAuth: [] }],
                body: {
                    type: 'object',
                    properties: {
                        app_tour_completed: { type: 'boolean' },
                        app_tour_current_step: { type: 'integer' },
                        complete_page_tour: { type: 'string' },
                        skip_tour: { type: 'string' },
                    },
                },
                response: {
                    200: tourStateResponse,
                    500: common.errorResponse,
                },
            },
        },
        tourController.updateTourState,
    );

    fastify.post(
        '/users/me/tour-state/reset',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Reset a specific tour or all tours',
                tags: ['Tour'],
                security: [{ bearerAuth: [] }],
                body: {
                    type: 'object',
                    required: ['tour_id'],
                    properties: {
                        tour_id: { type: 'string' },
                    },
                },
                response: {
                    200: tourStateResponse,
                    404: common.errorResponse,
                    500: common.errorResponse,
                },
            },
        },
        tourController.resetTour,
    );
}

module.exports = tourRoutes;
