import { App } from './app';
import { Database } from './config/database';
import { logger } from './utils/logger';

async function startServer() {
  try {
    const database = Database.getInstance();
    await database.connect();

    const app = new App();
    app.listen();

    process.on('unhandledRejection', (err: Error) => {
      logger.error('Unhandled Rejection:', err);
      process.exit(1);
    });

    process.on('uncaughtException', (err: Error) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received. Shutting down gracefully...');
      await database.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received. Shutting down gracefully...');
      await database.disconnect();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();