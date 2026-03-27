import mongoose from 'mongoose';
import config from './index.js';
import { logger } from '../utils/logger.js';

/**
 * Database connection class
 * @class
 * @description MongoDB connection and disconnection
 */
class DatabaseConnection {
    constructor() {
        this.isConnected = false;
    }

    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    async connect() {
        if (this.isConnected) {
            logger.info('Database already connected');
            return;
        }

        try {
            await mongoose.connect(config.database.uri);
            this.isConnected = true;
            logger.info('MongoDB connected successfully');

            mongoose.connection.on('error', (err) => {
                logger.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected');
                this.isConnected = false;
            });

            mongoose.connection.on('reconnected', () => {
                logger.info('MongoDB reconnected');
                this.isConnected = true;
            });
        } catch (error) {
            logger.error('MongoDB connection failed:', error);
            throw error;
        }
    }

    async disconnect() {
        if (!this.isConnected) return;
        await mongoose.disconnect();
        this.isConnected = false;
        logger.info('MongoDB disconnected successfully');
    }
}

export default DatabaseConnection;
