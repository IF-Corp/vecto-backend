// Mock dependencies before requiring the controller
jest.mock('../../../src/models', () => ({
    User: {
        findByPk: jest.fn()
    },
    UserPreferences: {
        findOne: jest.fn(),
        create: jest.fn()
    }
}));

const userController = require('../../../src/controllers/userController');
const { User, UserPreferences } = require('../../../src/models');

describe('UserController', () => {
    let mockRequest;
    let mockReply;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRequest = {
            body: {},
            params: {},
            user: { id: 'user-uuid' }
        };

        mockReply = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
    });

    describe('completeOnboarding', () => {
        it('should update user nickname and preferences', async () => {
            mockRequest.body = {
                nickname: 'TestUser',
                timezone: 'America/Sao_Paulo',
                currency: 'BRL',
                modules: {
                    habits: true,
                    productivity: true,
                    finance: false,
                    health: false,
                    studies: false,
                    work: false,
                    social: false,
                    home: false
                }
            };

            const mockUser = {
                id: 'user-uuid',
                email: 'test@example.com',
                name: 'Test User',
                nickname: null,
                is_onboarded: false,
                save: jest.fn()
            };

            const mockPreferences = {
                timezone: 'America/Sao_Paulo',
                default_currency: 'BRL',
                enabled_modules: ['habits', 'productivity'],
                update: jest.fn()
            };

            User.findByPk.mockResolvedValue(mockUser);
            UserPreferences.findOne.mockResolvedValue(mockPreferences);

            await userController.completeOnboarding(mockRequest, mockReply);

            expect(User.findByPk).toHaveBeenCalledWith('user-uuid');
            expect(mockUser.nickname).toBe('TestUser');
            expect(mockUser.is_onboarded).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockPreferences.update).toHaveBeenCalledWith({
                timezone: 'America/Sao_Paulo',
                default_currency: 'BRL',
                enabled_modules: ['habits', 'productivity']
            });
            expect(mockReply.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        user: expect.objectContaining({
                            nickname: 'TestUser',
                            is_onboarded: true
                        })
                    })
                })
            );
        });

        it('should create preferences if none exist', async () => {
            mockRequest.body = {
                nickname: 'NewUser',
                timezone: 'Europe/London',
                currency: 'EUR',
                modules: {
                    habits: true,
                    productivity: false,
                    finance: true,
                    health: false,
                    studies: false,
                    work: false,
                    social: false,
                    home: false
                }
            };

            const mockUser = {
                id: 'user-uuid',
                email: 'new@example.com',
                name: 'New User',
                nickname: null,
                is_onboarded: false,
                save: jest.fn()
            };

            const createdPreferences = {
                user_id: 'user-uuid',
                timezone: 'Europe/London',
                default_currency: 'EUR',
                enabled_modules: ['habits', 'finance']
            };

            User.findByPk.mockResolvedValue(mockUser);
            UserPreferences.findOne.mockResolvedValue(null);
            UserPreferences.create.mockResolvedValue(createdPreferences);

            await userController.completeOnboarding(mockRequest, mockReply);

            expect(UserPreferences.create).toHaveBeenCalledWith({
                user_id: 'user-uuid',
                timezone: 'Europe/London',
                default_currency: 'EUR',
                enabled_modules: ['habits', 'finance']
            });
            expect(mockReply.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true
                })
            );
        });

        it('should return 404 if user not found', async () => {
            mockRequest.body = {
                nickname: 'Test',
                timezone: 'America/Sao_Paulo',
                currency: 'BRL',
                modules: {}
            };

            User.findByPk.mockResolvedValue(null);

            await userController.completeOnboarding(mockRequest, mockReply);

            expect(mockReply.status).toHaveBeenCalledWith(404);
            expect(mockReply.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: 'Not Found'
                })
            );
        });

        it('should handle empty nickname', async () => {
            mockRequest.body = {
                nickname: '',
                timezone: 'America/Sao_Paulo',
                currency: 'BRL',
                modules: { habits: true }
            };

            const mockUser = {
                id: 'user-uuid',
                email: 'test@example.com',
                name: 'Test User',
                nickname: null,
                is_onboarded: false,
                save: jest.fn()
            };

            const mockPreferences = {
                timezone: 'America/Sao_Paulo',
                default_currency: 'BRL',
                enabled_modules: ['habits'],
                update: jest.fn()
            };

            User.findByPk.mockResolvedValue(mockUser);
            UserPreferences.findOne.mockResolvedValue(mockPreferences);

            await userController.completeOnboarding(mockRequest, mockReply);

            expect(mockUser.nickname).toBeNull();
            expect(mockUser.is_onboarded).toBe(true);
        });
    });
});
