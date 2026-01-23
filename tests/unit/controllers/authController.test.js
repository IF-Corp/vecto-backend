const bcrypt = require('bcrypt');

// Mock dependencies before requiring the controller
jest.mock('bcrypt');
jest.mock('../../../src/models', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn()
    }
}));
jest.mock('../../../src/services/tokenService');

const authController = require('../../../src/controllers/authController');
const { User } = require('../../../src/models');
const tokenService = require('../../../src/services/tokenService');

describe('AuthController', () => {
    let mockRequest;
    let mockReply;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRequest = {
            body: {},
            params: {},
            user: {}
        };

        mockReply = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
    });

    describe('register', () => {
        it('should create a new user and return tokens', async () => {
            mockRequest.body = {
                email: 'new@example.com',
                password: 'password123',
                name: 'New User'
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_password');
            User.create.mockResolvedValue({
                id: 'user-uuid',
                email: 'new@example.com',
                name: 'New User'
            });
            tokenService.generateTokens.mockReturnValue({
                accessToken: 'access-token',
                refreshToken: 'refresh-token'
            });

            await authController.register(mockRequest, mockReply);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
            expect(User.create).toHaveBeenCalledWith({
                email: 'new@example.com',
                password_hash: 'hashed_password',
                name: 'New User',
                is_onboarded: false
            });
            expect(mockReply.status).toHaveBeenCalledWith(201);
            expect(mockReply.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        accessToken: 'access-token',
                        refreshToken: 'refresh-token'
                    })
                })
            );
        });

        it('should return 409 if email already exists', async () => {
            mockRequest.body = {
                email: 'existing@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue({ id: 'existing-user' });

            await authController.register(mockRequest, mockReply);

            expect(mockReply.status).toHaveBeenCalledWith(409);
            expect(mockReply.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: 'Conflict'
                })
            );
        });
    });

    describe('login', () => {
        it('should return tokens on valid credentials', async () => {
            mockRequest.body = {
                email: 'user@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue({
                id: 'user-uuid',
                email: 'user@example.com',
                name: 'Test User',
                password_hash: 'hashed_password'
            });
            bcrypt.compare.mockResolvedValue(true);
            tokenService.generateTokens.mockReturnValue({
                accessToken: 'access-token',
                refreshToken: 'refresh-token'
            });

            await authController.login(mockRequest, mockReply);

            expect(mockReply.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        accessToken: 'access-token'
                    })
                })
            );
        });

        it('should return 401 on invalid email', async () => {
            mockRequest.body = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue(null);

            await authController.login(mockRequest, mockReply);

            expect(mockReply.status).toHaveBeenCalledWith(401);
            expect(mockReply.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: 'Unauthorized'
                })
            );
        });

        it('should return 401 on invalid password', async () => {
            mockRequest.body = {
                email: 'user@example.com',
                password: 'wrongpassword'
            };

            User.findOne.mockResolvedValue({
                id: 'user-uuid',
                password_hash: 'hashed_password'
            });
            bcrypt.compare.mockResolvedValue(false);

            await authController.login(mockRequest, mockReply);

            expect(mockReply.status).toHaveBeenCalledWith(401);
        });

        it('should return 401 if user has no password set', async () => {
            mockRequest.body = {
                email: 'user@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue({
                id: 'user-uuid',
                password_hash: null
            });

            await authController.login(mockRequest, mockReply);

            expect(mockReply.status).toHaveBeenCalledWith(401);
            expect(mockReply.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Account requires password setup'
                })
            );
        });
    });

    describe('refresh', () => {
        it('should return new tokens on valid refresh token', async () => {
            mockRequest.body = {
                refreshToken: 'valid-refresh-token'
            };

            tokenService.verifyRefreshToken.mockReturnValue({ id: 'user-uuid' });
            User.findByPk.mockResolvedValue({
                id: 'user-uuid',
                email: 'user@example.com'
            });
            tokenService.generateTokens.mockReturnValue({
                accessToken: 'new-access-token',
                refreshToken: 'new-refresh-token'
            });

            await authController.refresh(mockRequest, mockReply);

            expect(mockReply.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        accessToken: 'new-access-token'
                    })
                })
            );
        });

        it('should return 401 on invalid refresh token', async () => {
            mockRequest.body = {
                refreshToken: 'invalid-token'
            };

            tokenService.verifyRefreshToken.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await authController.refresh(mockRequest, mockReply);

            expect(mockReply.status).toHaveBeenCalledWith(401);
        });
    });

    describe('me', () => {
        it('should return user data', async () => {
            mockRequest.user = { id: 'user-uuid' };

            User.findByPk.mockResolvedValue({
                id: 'user-uuid',
                email: 'user@example.com',
                name: 'Test User'
            });

            await authController.me(mockRequest, mockReply);

            expect(User.findByPk).toHaveBeenCalledWith('user-uuid', {
                attributes: { exclude: ['password_hash'] }
            });
            expect(mockReply.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true
                })
            );
        });

        it('should return 404 if user not found', async () => {
            mockRequest.user = { id: 'nonexistent-uuid' };

            User.findByPk.mockResolvedValue(null);

            await authController.me(mockRequest, mockReply);

            expect(mockReply.status).toHaveBeenCalledWith(404);
        });
    });
});
