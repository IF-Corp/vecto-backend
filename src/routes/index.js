const userRoutes = require('./userRoutes');
const coreRoutes = require('./coreRoutes');

async function routes(fastify, options) {
    // Health check endpoint
    fastify.get('/health', async (request, reply) => {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'vecto-backend'
        };
    });

    // Register API routes with /api prefix
    fastify.register(userRoutes, { prefix: '/api' });
    fastify.register(coreRoutes, { prefix: '/api' });
}

module.exports = routes;
