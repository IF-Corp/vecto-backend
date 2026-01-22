const fastify = require('fastify');
const cors = require('@fastify/cors');
const env = require('@fastify/env');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

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

    // Set error handler
    app.setErrorHandler(errorHandler);

    // Register routes
    await app.register(routes);

    return app;
}

module.exports = buildApp;
