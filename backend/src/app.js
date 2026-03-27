import express from 'express';

//Middleware
import corsMiddleware from './middleware/cors.js';
import securityMiddleware from './middleware/security.js';
import { generalLimiter } from './middleware/rateLimit.js';
import httpLogger from './middleware/logging.js';
import requestId from './middleware/requestId.js';

//App Routes & Error Handling
import routes from './routes/index.js';
import { handleError } from './utils/errorHandler.js';
import { logger } from './utils/logger.js';
import { STATUS_CODES, MESSAGES } from './utils/constants.js';

/**
 * Application class
 * @module app
 * @description Application class for initializing the app
 */
class Application {
    constructor() {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    initializeMiddlewares() {
        // Request ID tracking
        this.app.use(requestId);

        // Security
        this.app.use(securityMiddleware);
        this.app.use(corsMiddleware);

        // Logging
        this.app.use(httpLogger);

        // Rate Limiting
        this.app.use(generalLimiter);

        // Body parsing
        this.app.use(express.json({ limit: '5mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));

        logger.info('Middlewares initialized');
    }

    initializeRoutes() {
        // API routes
        this.app.use('/api/v1', routes);

        // Root route
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                message: MESSAGES.SYSTEM.HEALTH,
                version: '1.0.0',
                timestamp: new Date().toISOString()
            });
        });

        // Catch-all for undefined routes
        this.app.use((req, res) => {
            res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: MESSAGES.SYSTEM.NOT_FOUND
            });
        });

        logger.info('Routes initialized');
    }

    initializeErrorHandling() {
        // Global error handler  middleware
        this.app.use(handleError);
        logger.info('Error handling initialized');
    }

    getApp() {
        return this.app;
    }
}

export default new Application();
