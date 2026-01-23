const fp = require('fastify-plugin');
const swagger = require('@fastify/swagger');
const swaggerUi = require('@fastify/swagger-ui');

async function swaggerPlugin(fastify, opts) {
    await fastify.register(swagger, {
        openapi: {
            info: {
                title: 'Vecto API',
                description: 'Backend API for Vecto - Personal Life Management Application',
                version: '1.0.0',
                contact: {
                    name: 'Vecto Team'
                }
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Development server'
                }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'Enter your JWT token'
                    }
                }
            },
            tags: [
                { name: 'Auth', description: 'Authentication endpoints' },
                { name: 'Users', description: 'User management' },
                { name: 'Core', description: 'Core features (preferences, categories, notifications)' },
                { name: 'Habits', description: 'Habits, routines, and social groups' },
                { name: 'Projects', description: 'Projects, tasks, and meetings' },
                { name: 'Finance', description: 'Accounts, transactions, budgets' },
                { name: 'Health', description: 'Meals, workouts, medications, sleep' },
                { name: 'Study', description: 'Library, sessions, reviews, notes' },
                { name: 'Home', description: 'Shopping, inventory, chores, contacts, events' },
                { name: 'Freeze Mode', description: 'Freeze mode configuration' }
            ]
        }
    });

    await fastify.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: true,
            displayRequestDuration: true,
            filter: true,
            showExtensions: true,
            showCommonExtensions: true
        },
        staticCSP: true,
        transformStaticCSP: (header) => header
    });
}

module.exports = fp(swaggerPlugin, {
    name: 'swagger-plugin'
});
