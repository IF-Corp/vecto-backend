const { UserPreferences, OnboardingState, GlobalCategory, NotificationConfig } = require('../models');

class CoreController {
    // ==================== USER PREFERENCES ====================

    async getPreferences(request, reply) {
        try {
            const { userId } = request.params;

            const preferences = await UserPreferences.findOne({
                where: { user_id: userId }
            });

            if (!preferences) {
                return reply.status(404).send({
                    success: false,
                    error: 'Preferences not found'
                });
            }

            return reply.send({
                success: true,
                data: preferences
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }

    async upsertPreferences(request, reply) {
        try {
            const { userId } = request.params;
            const data = request.body;

            const [preferences, created] = await UserPreferences.findOrCreate({
                where: { user_id: userId },
                defaults: { user_id: userId, ...data }
            });

            if (!created) {
                await preferences.update(data);
            }

            return reply.status(created ? 201 : 200).send({
                success: true,
                data: preferences,
                created
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }

    // ==================== ONBOARDING STATE ====================

    async getOnboardingState(request, reply) {
        try {
            const { userId } = request.params;

            const state = await OnboardingState.findOne({
                where: { user_id: userId }
            });

            if (!state) {
                return reply.status(404).send({
                    success: false,
                    error: 'Onboarding state not found'
                });
            }

            return reply.send({
                success: true,
                data: state
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }

    async upsertOnboardingState(request, reply) {
        try {
            const { userId } = request.params;
            const { completed, current_step, selected_modules } = request.body;

            const [state, created] = await OnboardingState.findOrCreate({
                where: { user_id: userId },
                defaults: {
                    user_id: userId,
                    completed: completed || false,
                    current_step,
                    selected_modules: selected_modules || []
                }
            });

            if (!created) {
                await state.update({ completed, current_step, selected_modules });
            }

            return reply.status(created ? 201 : 200).send({
                success: true,
                data: state,
                created
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }

    // ==================== GLOBAL CATEGORIES ====================

    async getCategories(request, reply) {
        try {
            const { userId } = request.params;
            const { type } = request.query;

            const where = { user_id: userId };
            if (type) {
                where.type = type;
            }

            const categories = await GlobalCategory.findAll({ where });

            return reply.send({
                success: true,
                data: categories
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }

    async createCategory(request, reply) {
        try {
            const { userId } = request.params;
            const { name, color_hex, icon, type } = request.body;

            if (!name) {
                return reply.status(400).send({
                    success: false,
                    error: 'Name is required'
                });
            }

            const category = await GlobalCategory.create({
                user_id: userId,
                name,
                color_hex,
                icon,
                type: type || 'TAG'
            });

            return reply.status(201).send({
                success: true,
                data: category
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }

    async updateCategory(request, reply) {
        try {
            const { id } = request.params;
            const { name, color_hex, icon, type } = request.body;

            const category = await GlobalCategory.findByPk(id);

            if (!category) {
                return reply.status(404).send({
                    success: false,
                    error: 'Category not found'
                });
            }

            await category.update({ name, color_hex, icon, type });

            return reply.send({
                success: true,
                data: category
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }

    async deleteCategory(request, reply) {
        try {
            const { id } = request.params;

            const category = await GlobalCategory.findByPk(id);

            if (!category) {
                return reply.status(404).send({
                    success: false,
                    error: 'Category not found'
                });
            }

            await category.destroy();

            return reply.send({
                success: true,
                message: 'Category deleted'
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }

    // ==================== NOTIFICATION CONFIG ====================

    async getNotificationConfigs(request, reply) {
        try {
            const { userId } = request.params;

            const configs = await NotificationConfig.findAll({
                where: { user_id: userId }
            });

            return reply.send({
                success: true,
                data: configs
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }

    async upsertNotificationConfig(request, reply) {
        try {
            const { userId } = request.params;
            const { channel, alert_type, active } = request.body;

            if (!channel || !alert_type) {
                return reply.status(400).send({
                    success: false,
                    error: 'Channel and alert_type are required'
                });
            }

            const [config, created] = await NotificationConfig.findOrCreate({
                where: {
                    user_id: userId,
                    channel,
                    alert_type
                },
                defaults: {
                    user_id: userId,
                    channel,
                    alert_type,
                    active: active !== undefined ? active : true
                }
            });

            if (!created && active !== undefined) {
                await config.update({ active });
            }

            return reply.status(created ? 201 : 200).send({
                success: true,
                data: config,
                created
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }

    async deleteNotificationConfig(request, reply) {
        try {
            const { id } = request.params;

            const config = await NotificationConfig.findByPk(id);

            if (!config) {
                return reply.status(404).send({
                    success: false,
                    error: 'Notification config not found'
                });
            }

            await config.destroy();

            return reply.send({
                success: true,
                message: 'Notification config deleted'
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new CoreController();
