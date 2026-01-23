const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters');
    }
    return secret;
}

function getRefreshSecret() {
    return process.env.JWT_REFRESH_SECRET || getJwtSecret() + '_refresh';
}

function generateTokens(user) {
    const payload = {
        id: user.id,
        email: user.email
    };

    const accessToken = jwt.sign(payload, getJwtSecret(), {
        expiresIn: ACCESS_TOKEN_EXPIRY
    });

    const refreshToken = jwt.sign(payload, getRefreshSecret(), {
        expiresIn: REFRESH_TOKEN_EXPIRY
    });

    return { accessToken, refreshToken };
}

function verifyAccessToken(token) {
    return jwt.verify(token, getJwtSecret());
}

function verifyRefreshToken(token) {
    return jwt.verify(token, getRefreshSecret());
}

function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = {
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken,
    decodeToken,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY
};
