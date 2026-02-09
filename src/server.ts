import app from './app';
import { AppDataSource } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize database
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info('Database connection established');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
