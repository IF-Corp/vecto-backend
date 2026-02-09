const fastify = require('fastify');
const cors = require('@fastify/cors');
const env = require('@fastify/env');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const authPlugin = require('./plugins/auth');
const freezeGuardPlugin = require('./plugins/freezeGuard');
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
        },
        FIREBASE_PROJECT_ID: {
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
    const allowedOrigins = app.config.NODE_ENV === 'production'
        ? app.config.CORS_ORIGIN.split(',').map(o => o.trim())
        : ['http://localhost:3001', 'http://localhost:3000', 'http://127.0.0.1:3001'];

    await app.register(cors, {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'), false);
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });

    // Register Swagger documentation (before routes to collect schemas)
    if (app.config.NODE_ENV !== 'production') {
        await app.register(swaggerPlugin);
    }

    // Register rate limiting
    await app.register(rateLimitPlugin);

    // Register authentication plugin
    await app.register(authPlugin);

    // Register freeze guard (blocks writes on frozen modules)
    await app.register(freezeGuardPlugin);

    // Set error handler
    app.setErrorHandler(errorHandler);

    // Register routes
    await app.register(routes);

    return app;
}

module.exports = buildApp;
