const jwt = require('jsonwebtoken');

const TEST_USER = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User'
};

function generateTestToken(user = TEST_USER, expiresIn = '1h') {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn }
    );
}

function generateExpiredToken(user = TEST_USER) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' }
    );
}

function getAuthHeaders(user = TEST_USER) {
    const token = generateTestToken(user);
    return {
        Authorization: `Bearer ${token}`
    };
}

function getInvalidAuthHeaders() {
    return {
        Authorization: 'Bearer invalid-token'
    };
}

function getExpiredAuthHeaders(user = TEST_USER) {
    const token = generateExpiredToken(user);
    return {
        Authorization: `Bearer ${token}`
    };
}

module.exports = {
    TEST_USER,
    generateTestToken,
    generateExpiredToken,
    getAuthHeaders,
    getInvalidAuthHeaders,
    getExpiredAuthHeaders
};
