const { User } = require('../models');

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
            request.log.error(error);
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
            request.log.error(error);
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
            request.log.error(error);
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
            request.log.error(error);
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
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error',
                message: error.message
            });
        }
    }
}

module.exports = new UserController();
