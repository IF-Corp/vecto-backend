const fastify = require('fastify');
const cors = require('@fastify/cors');
const env = require('@fastify/env');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const authPlugin = require('./plugins/auth');
const rateLimitPlugin = require('./plugins/rateLimit');
const swaggerPlugin = require('./plugins/swagger');

const schema = {
    type: 'object',
    required: ['PORT'],
    properties: {
        PORT: {
            type: 'string',
            default: '3000'
        },
        HOST: {
            type: 'string',
            default: '0.0.0.0'
        },
        NODE_ENV: {
            type: 'string',
            default: 'development'
        },
        CORS_ORIGIN: {
            type: 'string',
            default: '*'
        },
        JWT_SECRET: {
            type: 'string',
            default: 'development-secret-change-in-production-minimum-32-characters'
        },
        JWT_REFRESH_SECRET: {
            type: 'string',
            default: ''
        }
    }
};

async function buildApp(opts = {}) {
    const app = fastify({
        logger: false, // Using console.log instead
        ...opts
    });

    // Register environment plugin
    await app.register(env, {
        schema,
        dotenv: true
    });

    // Register CORS
    await app.register(cors, {
        origin: app.config.CORS_ORIGIN || '*',
        credentials: true
    });

    // Register Swagger documentation (before routes to collect schemas)
    if (app.config.NODE_ENV !== 'production') {
        await app.register(swaggerPlugin);
    }

    // Register rate limiting
    await app.register(rateLimitPlugin);

    // Register authentication plugin
    await app.register(authPlugin);

    // Set error handler
    app.setErrorHandler(errorHandler);

    // Register routes
    await app.register(routes);

    return app;
}

module.exports = buildApp;
