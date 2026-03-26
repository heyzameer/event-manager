require('dotenv').config();

const appInstance = require('./app');
const DatabaseConnection = require('./config/database');
const config = require('./config');
const { logger } = require('./utils/logger');

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception! Shutting down...', error);
    process.exit(1);
});

async function startServer() {
    try {
        // 1. Connect to Database (using your custom connectDB or the Singleton)
        const db = DatabaseConnection.getInstance ? DatabaseConnection.getInstance() : DatabaseConnection;
        await db.connect();

        const app = appInstance.getApp();
        const server = app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port} in ${config.env} mode`);
            logger.info(`API available at http://localhost:${config.port}/api/v1`);
        });

        const gracefulShutdown = async (signal) => {
            logger.info(`Received ${signal}. Starting graceful shutdown...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                try {
                    if (db.disconnect) await db.disconnect();
                    logger.info('Database connection closed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during database disconnect:', error);
                    process.exit(1);
                }
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT')); // Ctrl+C

    } catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
