const app = require('./app');
const config = require('./config/env');
const prisma = require('./config/prisma');

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('PostgreSQL database connected successfully.');

    const server = app.listen(config.port, () => {
      console.log(`Expense Voucher API server running on port ${config.port} [${config.nodeEnv}]`);
      console.log(`API URL: http://localhost:${config.port}/api`);
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Database connection closed. Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
