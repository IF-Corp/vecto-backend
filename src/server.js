const buildApp = require('./app');
const sequelize =require('./config/sequelize');

async function startServer() {
  let app;
  
  try {
    // Build Fastify app
    app = await buildApp();

    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Start server
    const port = app.config.PORT || 3000;
    const host = app.config.HOST || '0.0.0.0';
    
    await app.listen({ port: parseInt(port), host });
    
    console.log(`Server listening on http://${host}:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }

  // Graceful shutdown
  const signals = ['SIGINT', 'SIGTERM'];
  
  signals.forEach(signal => {
    process.on(signal, async () => {
      console.log(`${signal} received, closing server gracefully...`);
      
      try {
        await app.close();
        await sequelize.close();
        console.log('Server closed successfully');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    });
  });
}

startServer();
