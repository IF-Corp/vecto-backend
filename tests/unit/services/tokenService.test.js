const jwt = require('jsonwebtoken');

// Mock jwt module
jest.mock('jsonwebtoken');

// Set env vars before requiring service
process.env.JWT_SECRET = 'test-jwt-secret-32-characters-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-32-characters';

const tokenService = require('../../../src/services/tokenService');

describe('TokenService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateTokens', () => {
        it('should generate access and refresh tokens', () => {
            const user = { id: 'user-uuid', email: 'test@example.com' };

            jwt.sign
                .mockReturnValueOnce('access-token')
                .mockReturnValueOnce('refresh-token');

            const tokens = tokenService.generateTokens(user);

            expect(tokens).toEqual({
                accessToken: 'access-token',
                refreshToken: 'refresh-token'
            });
            expect(jwt.sign).toHaveBeenCalledTimes(2);
            expect(jwt.sign).toHaveBeenNthCalledWith(
                1,
                { id: 'user-uuid', email: 'test@example.com' },
                expect.any(String),
                { expiresIn: '15m' }
            );
            expect(jwt.sign).toHaveBeenNthCalledWith(
                2,
                { id: 'user-uuid', email: 'test@example.com' },
                expect.any(String),
                { expiresIn: '7d' }
            );
        });
    });

    describe('verifyAccessToken', () => {
        it('should return decoded payload for valid token', () => {
            const payload = { id: 'user-uuid', email: 'test@example.com' };
            jwt.verify.mockReturnValue(payload);

            const result = tokenService.verifyAccessToken('valid-token');

            expect(result).toEqual(payload);
            expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
        });

        it('should throw error for invalid token', () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('invalid token');
            });

            expect(() => tokenService.verifyAccessToken('invalid-token')).toThrow('invalid token');
        });
    });

    describe('verifyRefreshToken', () => {
        it('should return decoded payload for valid refresh token', () => {
            const payload = { id: 'user-uuid', email: 'test@example.com' };
            jwt.verify.mockReturnValue(payload);

            const result = tokenService.verifyRefreshToken('valid-refresh-token');

            expect(result).toEqual(payload);
            expect(jwt.verify).toHaveBeenCalledWith('valid-refresh-token', expect.any(String));
        });

        it('should throw error for invalid refresh token', () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('invalid token');
            });

            expect(() => tokenService.verifyRefreshToken('invalid-token')).toThrow('invalid token');
        });
    });
});
