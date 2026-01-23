const fp = require('fastify-plugin');
const jwt = require('@fastify/jwt');

async function authPlugin(fastify, opts) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || jwtSecret.length < 32) {
        fastify.log.warn('JWT_SECRET not set or too short. Authentication will fail.');
    }

    await fastify.register(jwt, {
        secret: jwtSecret || 'development-secret-change-in-production-min-32-chars',
        sign: {
            expiresIn: '15m'
        }
    });

    // Decorator: authenticate - verifies JWT token
    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.status(401).send({
                success: false,
                error: 'Unauthorized',
                message: err.message === 'Authorization token expired'
                    ? 'Token expired'
                    : 'Invalid or missing token'
            });
        }
    });

    // Decorator: authorizeUser - verifies JWT and checks if user owns the resource
    fastify.decorate('authorizeUser', async function (request, reply) {
        try {
            await request.jwtVerify();

            const { userId } = request.params;
            if (userId && request.user.id !== userId) {
                return reply.status(403).send({
                    success: false,
                    error: 'Forbidden',
                    message: 'You do not have access to this resource'
                });
            }
        } catch (err) {
            reply.status(401).send({
                success: false,
                error: 'Unauthorized',
                message: err.message === 'Authorization token expired'
                    ? 'Token expired'
                    : 'Invalid or missing token'
            });
        }
    });

    // Decorator: optionalAuth - verifies JWT if present, but doesn't require it
    fastify.decorate('optionalAuth', async function (request, reply) {
        try {
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                await request.jwtVerify();
            }
        } catch (err) {
            // Silently ignore auth errors for optional auth
            request.user = null;
        }
    });
}

module.exports = fp(authPlugin, {
    name: 'auth-plugin'
});
