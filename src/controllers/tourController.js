const { TourState } = require('../models');

class TourController {
    async getTourState(request, reply) {
        try {
            const userId = request.user.id;

            const [tourState] = await TourState.findOrCreate({
                where: { user_id: userId },
                defaults: {
                    user_id: userId,
                    app_tour_completed: false,
                    app_tour_current_step: 0,
                    completed_page_tours: [],
                    skipped_tours: []
                }
            });

            return reply.send({
                success: true,
                data: {
                    app_tour_completed: tourState.app_tour_completed,
                    app_tour_current_step: tourState.app_tour_current_step,
                    completed_page_tours: tourState.completed_page_tours || [],
                    skipped_tours: tourState.skipped_tours || []
                }
            });
        } catch (error) {
            console.error('Get tour state error:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }

    async updateTourState(request, reply) {
        try {
            const userId = request.user.id;
            const { app_tour_completed, app_tour_current_step, complete_page_tour, skip_tour } = request.body;

            const [tourState] = await TourState.findOrCreate({
                where: { user_id: userId },
                defaults: {
                    user_id: userId,
                    app_tour_completed: false,
                    app_tour_current_step: 0,
                    completed_page_tours: [],
                    skipped_tours: []
                }
            });

            const updates = {};

            if (app_tour_completed !== undefined) {
                updates.app_tour_completed = app_tour_completed;
            }

            if (app_tour_current_step !== undefined) {
                updates.app_tour_current_step = app_tour_current_step;
            }

            if (complete_page_tour) {
                const current = tourState.completed_page_tours || [];
                if (!current.includes(complete_page_tour)) {
                    updates.completed_page_tours = [...current, complete_page_tour];
                }
            }

            if (skip_tour) {
                const current = tourState.skipped_tours || [];
                if (!current.includes(skip_tour)) {
                    updates.skipped_tours = [...current, skip_tour];
                }
            }

            if (Object.keys(updates).length > 0) {
                await tourState.update(updates);
            }

            return reply.send({
                success: true,
                data: {
                    app_tour_completed: tourState.app_tour_completed,
                    app_tour_current_step: tourState.app_tour_current_step,
                    completed_page_tours: tourState.completed_page_tours || [],
                    skipped_tours: tourState.skipped_tours || []
                }
            });
        } catch (error) {
            console.error('Update tour state error:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }

    async resetTour(request, reply) {
        try {
            const userId = request.user.id;
            const { tour_id } = request.body;

            const tourState = await TourState.findOne({
                where: { user_id: userId }
            });

            if (!tourState) {
                return reply.status(404).send({
                    success: false,
                    error: 'Not Found',
                    message: 'Tour state not found'
                });
            }

            if (tour_id === 'all') {
                await tourState.update({
                    app_tour_completed: false,
                    app_tour_current_step: 0,
                    completed_page_tours: [],
                    skipped_tours: []
                });
            } else if (tour_id === 'app') {
                await tourState.update({
                    app_tour_completed: false,
                    app_tour_current_step: 0,
                    skipped_tours: (tourState.skipped_tours || []).filter(t => t !== 'app')
                });
            } else {
                const completedPages = (tourState.completed_page_tours || []).filter(t => t !== tour_id);
                const skippedTours = (tourState.skipped_tours || []).filter(t => t !== tour_id);
                await tourState.update({
                    completed_page_tours: completedPages,
                    skipped_tours: skippedTours
                });
            }

            return reply.send({
                success: true,
                data: {
                    app_tour_completed: tourState.app_tour_completed,
                    app_tour_current_step: tourState.app_tour_current_step,
                    completed_page_tours: tourState.completed_page_tours || [],
                    skipped_tours: tourState.skipped_tours || []
                }
            });
        } catch (error) {
            console.error('Reset tour error:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }
}

module.exports = new TourController();
