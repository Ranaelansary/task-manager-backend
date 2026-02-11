import app from './app';
import { AppDataSource } from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize database
    if (!AppDataSource.isInitialized) {
      console.log('[INFO] Initializing database connection...');
      await AppDataSource.initialize();
      console.log('[INFO] Database connection established');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`[INFO] Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[ERROR] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
