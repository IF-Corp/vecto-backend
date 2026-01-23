const fp = require('fastify-plugin');
const rateLimit = require('@fastify/rate-limit');

async function rateLimitPlugin(fastify, opts) {
    await fastify.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
        keyGenerator: function (request) {
            // Use user ID if authenticated, otherwise use IP
            return request.user?.id || request.ip;
        },
        errorResponseBuilder: function (request, context) {
            return {
                success: false,
                error: 'Too Many Requests',
                message: `Rate limit exceeded. Try again in ${context.after}`,
                statusCode: 429
            };
        },
        addHeadersOnExceeding: {
            'x-ratelimit-limit': true,
            'x-ratelimit-remaining': true,
            'x-ratelimit-reset': true
        },
        addHeaders: {
            'x-ratelimit-limit': true,
            'x-ratelimit-remaining': true,
            'x-ratelimit-reset': true,
            'retry-after': true
        }
    });
}

module.exports = fp(rateLimitPlugin, {
    name: 'rate-limit-plugin'
});
