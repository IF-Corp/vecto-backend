const userRoutes = require('./userRoutes');
const coreRoutes = require('./coreRoutes');
const habitRoutes = require('./habitRoutes');
const projectRoutes = require('./projectRoutes');
const financeRoutes = require('./financeRoutes');
const healthRoutes = require('./healthRoutes');
const studyRoutes = require('./studyRoutes');
const homeRoutes = require('./homeRoutes');
const freezeModeRoutes = require('./freezeModeRoutes');

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
    fastify.register(habitRoutes, { prefix: '/api' });
    fastify.register(projectRoutes, { prefix: '/api' });
    fastify.register(financeRoutes, { prefix: '/api' });
    fastify.register(healthRoutes, { prefix: '/api' });
    fastify.register(studyRoutes, { prefix: '/api' });
    fastify.register(homeRoutes, { prefix: '/api' });
    fastify.register(freezeModeRoutes, { prefix: '/api' });
}

module.exports = routes;
