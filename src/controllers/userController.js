const { User, UserPreferences } = require('../models');

class UserController {
    /**
     * Get user by ID
     */
    async getUser(request, reply) {
        try {
            const { id } = request.params;

            const user = await User.findByPk(id);

            if (!user) {
                return reply.status(404).send({
                    error: 'User not found',
                    message: `User with ID ${id} does not exist`
                });
            }

            return reply.send({
                success: true,
                data: user
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: 'Internal server error',
                message: error.message
            });
        }
    }

    /**
     * Get user by email
     */
    async getUserByEmail(request, reply) {
        try {
            const { email } = request.query;

            if (!email) {
                return reply.status(400).send({
                    error: 'Bad request',
                    message: 'Email query parameter is required'
                });
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return reply.status(404).send({
                    error: 'User not found',
                    message: `User with email ${email} does not exist`
                });
            }

            return reply.send({
                success: true,
                data: user
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: 'Internal server error',
                message: error.message
            });
        }
    }

    /**
     * Create or update user (upsert)
     * This will be called after Firebase authentication
     */
    async upsertUser(request, reply) {
        try {
            const { email, name } = request.body;

            if (!email) {
                return reply.status(400).send({
                    error: 'Bad request',
                    message: 'Email is required'
                });
            }

            const [user, created] = await User.findOrCreate({
                where: { email },
                defaults: {
                    email,
                    name: name || null,
                    is_onboarded: false
                }
            });

            // If user exists and name is provided, update it
            if (!created && name && user.name !== name) {
                user.name = name;
                await user.save();
            }

            return reply.status(created ? 201 : 200).send({
                success: true,
                data: user,
                created
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: 'Internal server error',
                message: error.message
            });
        }
    }

    /**
     * Update user onboarding status
     */
    async updateOnboardingStatus(request, reply) {
        try {
            const { id } = request.params;
            const { is_onboarded } = request.body;

            if (typeof is_onboarded !== 'boolean') {
                return reply.status(400).send({
                    error: 'Bad request',
                    message: 'is_onboarded must be a boolean value'
                });
            }

            const user = await User.findByPk(id);

            if (!user) {
                return reply.status(404).send({
                    error: 'User not found',
                    message: `User with ID ${id} does not exist`
                });
            }

            user.is_onboarded = is_onboarded;
            await user.save();

            return reply.send({
                success: true,
                data: user
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: 'Internal server error',
                message: error.message
            });
        }
    }

    /**
     * Update user profile
     */
    async updateUser(request, reply) {
        try {
            const { id } = request.params;
            const { name, is_onboarded } = request.body;

            const user = await User.findByPk(id);

            if (!user) {
                return reply.status(404).send({
                    error: 'User not found',
                    message: `User with ID ${id} does not exist`
                });
            }

            if (name !== undefined) {
                user.name = name;
            }

            if (typeof is_onboarded === 'boolean') {
                user.is_onboarded = is_onboarded;
            }

            await user.save();

            return reply.send({
                success: true,
                data: user
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: 'Internal server error',
                message: error.message
            });
        }
    }

    /**
     * Get current user's preferences
     */
    async getMyPreferences(request, reply) {
        try {
            const userId = request.user.id;

            let preferences = await UserPreferences.findOne({
                where: { user_id: userId }
            });

            if (!preferences) {
                // Create default preferences if none exist
                preferences = await UserPreferences.create({
                    user_id: userId
                });
            }

            return reply.send({
                success: true,
                data: preferences
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: 'Internal server error',
                message: error.message
            });
        }
    }

    /**
     * Update current user's preferences (including modules during onboarding)
     */
    async updateMyPreferences(request, reply) {
        try {
            const userId = request.user.id;
            const {
                default_currency,
                timezone,
                language,
                date_format,
                week_start_day,
                theme,
                sounds_enabled,
                compact_mode,
                enabled_modules
            } = request.body;

            let preferences = await UserPreferences.findOne({
                where: { user_id: userId }
            });

            const updateData = {};
            if (default_currency !== undefined) updateData.default_currency = default_currency;
            if (timezone !== undefined) updateData.timezone = timezone;
            if (language !== undefined) updateData.language = language;
            if (date_format !== undefined) updateData.date_format = date_format;
            if (week_start_day !== undefined) updateData.week_start_day = week_start_day;
            if (theme !== undefined) updateData.theme = theme;
            if (sounds_enabled !== undefined) updateData.sounds_enabled = sounds_enabled;
            if (compact_mode !== undefined) updateData.compact_mode = compact_mode;
            if (enabled_modules !== undefined) updateData.enabled_modules = enabled_modules;

            if (preferences) {
                await preferences.update(updateData);
            } else {
                preferences = await UserPreferences.create({
                    user_id: userId,
                    ...updateData
                });
            }

            return reply.send({
                success: true,
                data: preferences
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: 'Internal server error',
                message: error.message
            });
        }
    }

    /**
     * Complete onboarding - updates nickname, preferences and modules in one call
     */
    async completeOnboarding(request, reply) {
        try {
            const userId = request.user.id;
            const { nickname, timezone, currency, modules } = request.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return reply.status(404).send({
                    success: false,
                    error: 'Not Found',
                    message: 'User not found'
                });
            }

            user.nickname = nickname || null;
            user.is_onboarded = true;
            await user.save();

            const enabledModules = Object.entries(modules || {})
                .filter(([, enabled]) => enabled)
                .map(([key]) => key);

            let preferences = await UserPreferences.findOne({
                where: { user_id: userId }
            });

            const preferencesData = {
                timezone: timezone || 'America/Sao_Paulo',
                default_currency: currency || 'BRL',
                enabled_modules: enabledModules
            };

            if (preferences) {
                await preferences.update(preferencesData);
            } else {
                preferences = await UserPreferences.create({
                    user_id: userId,
                    ...preferencesData
                });
            }

            return reply.send({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        nickname: user.nickname,
                        is_onboarded: user.is_onboarded
                    },
                    preferences: {
                        timezone: preferences.timezone,
                        default_currency: preferences.default_currency,
                        enabled_modules: preferences.enabled_modules
                    }
                }
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }

    /**
     * Update only module settings for the current user
     */
    async updateMyModuleSettings(request, reply) {
        try {
            const userId = request.user.id;
            const { modules } = request.body;

            if (!Array.isArray(modules)) {
                return reply.status(400).send({
                    error: 'Bad request',
                    message: 'modules must be an array'
                });
            }

            // Validate module names
            const validModules = ['habits', 'projects', 'finance', 'health', 'study', 'home'];
            const invalidModules = modules.filter(m => !validModules.includes(m));

            if (invalidModules.length > 0) {
                return reply.status(400).send({
                    error: 'Bad request',
                    message: `Invalid modules: ${invalidModules.join(', ')}. Valid modules: ${validModules.join(', ')}`
                });
            }

            let preferences = await UserPreferences.findOne({
                where: { user_id: userId }
            });

            if (preferences) {
                await preferences.update({ enabled_modules: modules });
            } else {
                preferences = await UserPreferences.create({
                    user_id: userId,
                    enabled_modules: modules
                });
            }

            return reply.send({
                success: true,
                data: {
                    enabled_modules: preferences.enabled_modules
                }
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                error: 'Internal server error',
                message: error.message
            });
        }
    }
}

module.exports = new UserController();
