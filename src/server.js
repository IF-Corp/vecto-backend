const buildApp = require('./app');
const sequelize = require('./config/sequelize');
const logger = require('./utils/logger');

async function startServer() {
    let app;

    try {
        // Build Fastify app
        app = await buildApp();

        // Test database connection
        await sequelize.authenticate();
        logger.info('Database connection has been established successfully.');

        // Start server
        const port = app.config.PORT || 3000;
        const host = app.config.HOST || '0.0.0.0';

        await app.listen({ port: parseInt(port), host });

        logger.info(`Server listening on http://${host}:${port}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

    } catch (err) {
        logger.error('Error starting server:', err);
        process.exit(1);
    }

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];

    signals.forEach(signal => {
        process.on(signal, async () => {
            logger.info(`${signal} received, closing server gracefully...`);

            try {
                await app.close();
                await sequelize.close();
                logger.info('Server closed successfully');
                process.exit(0);
            } catch (err) {
                logger.error('Error during shutdown:', err);
                process.exit(1);
            }
        });
    });
}

startServer();
