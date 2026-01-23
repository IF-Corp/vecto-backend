const bcrypt = require('bcrypt');
const { User, UserPreferences } = require('../models');
const tokenService = require('../services/tokenService');
const googleAuthService = require('../services/googleAuthService');

const SALT_ROUNDS = 12;

class AuthController {
    async register(request, reply) {
        try {
            const { email, password, name } = request.body;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return reply.status(409).send({
                    success: false,
                    error: 'Conflict',
                    message: 'Email already registered'
                });
            }

            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

            const user = await User.create({
                email,
                password_hash: passwordHash,
                name: name || null,
                is_onboarded: false
            });

            const tokens = tokenService.generateTokens(user);

            return reply.status(201).send({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    },
                    ...tokens
                }
            });
        } catch (error) {
            console.error('Register error:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }

    async login(request, reply) {
        try {
            const { email, password } = request.body;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Invalid credentials'
                });
            }

            if (!user.password_hash) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Account requires password setup'
                });
            }

            const validPassword = await bcrypt.compare(password, user.password_hash);
            if (!validPassword) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Invalid credentials'
                });
            }

            const tokens = tokenService.generateTokens(user);

            return reply.send({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    },
                    ...tokens
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }

    /**
     * Google SSO Login/Register
     * If user exists, return tokens
     * If user does not exist, create new user and return tokens
     */
    async googleLogin(request, reply) {
        try {
            const { idToken } = request.body;

            if (!idToken) {
                return reply.status(400).send({
                    success: false,
                    error: 'Bad Request',
                    message: 'Google ID token is required'
                });
            }

            // Verify Google token and extract user info
            let googleUser;
            try {
                googleUser = await googleAuthService.verifyToken(idToken);
            } catch (error) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized',
                    message: error.message
                });
            }

            // Check if user exists by google_id or email
            let user = await User.findOne({
                where: { google_id: googleUser.googleId }
            });

            let isNewUser = false;

            if (!user) {
                // Check by email (user might have registered with email first)
                user = await User.findOne({
                    where: { email: googleUser.email }
                });

                if (user) {
                    // Link Google account to existing user
                    await user.update({
                        google_id: googleUser.googleId,
                        auth_provider: 'google',
                        avatar_url: user.avatar_url || googleUser.picture,
                        name: user.name || googleUser.name
                    });
                } else {
                    // Create new user
                    user = await User.create({
                        email: googleUser.email,
                        google_id: googleUser.googleId,
                        name: googleUser.name,
                        avatar_url: googleUser.picture,
                        auth_provider: 'google',
                        is_onboarded: false
                    });
                    isNewUser = true;
                }
            }

            const tokens = tokenService.generateTokens(user);

            return reply.status(isNewUser ? 201 : 200).send({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        avatar_url: user.avatar_url,
                        is_onboarded: user.is_onboarded
                    },
                    isNewUser,
                    ...tokens
                }
            });
        } catch (error) {
            console.error('Google login error:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }

    async refresh(request, reply) {
        try {
            const { refreshToken } = request.body;

            let decoded;
            try {
                decoded = tokenService.verifyRefreshToken(refreshToken);
            } catch (err) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Invalid or expired refresh token'
                });
            }

            const user = await User.findByPk(decoded.id);
            if (!user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized',
                    message: 'User not found'
                });
            }

            const tokens = tokenService.generateTokens(user);

            return reply.send({
                success: true,
                data: tokens
            });
        } catch (error) {
            console.error('Refresh error:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }

    async me(request, reply) {
        try {
            const user = await User.findByPk(request.user.id, {
                attributes: { exclude: ['password_hash'] }
            });

            if (!user) {
                return reply.status(404).send({
                    success: false,
                    error: 'Not Found',
                    message: 'User not found'
                });
            }

            return reply.send({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Me error:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }

    async changePassword(request, reply) {
        try {
            const { currentPassword, newPassword } = request.body;

            const user = await User.findByPk(request.user.id);
            if (!user) {
                return reply.status(404).send({
                    success: false,
                    error: 'Not Found',
                    message: 'User not found'
                });
            }

            if (user.password_hash) {
                const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
                if (!validPassword) {
                    return reply.status(401).send({
                        success: false,
                        error: 'Unauthorized',
                        message: 'Current password is incorrect'
                    });
                }
            }

            const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
            await user.update({ password_hash: passwordHash });

            return reply.send({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            console.error('Change password error:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }
}

module.exports = new AuthController();
