const express = require('express');

//Middlewares
const corsMiddleware = require('./middleware/cors');
const securityMiddleware = require('./middleware/security');
const { generalLimiter } = require('./middleware/rateLimit');
const httpLogger = require('./middleware/logging');

//App Routes & Error Handling
const routes = require('./routes');
const { handleError } = require('./utils/errorHandler');
const { logger } = require('./utils/logger');

class Application {
    constructor() {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    initializeMiddlewares() {
        // Security
        this.app.use(securityMiddleware);
        this.app.use(corsMiddleware);

        // Logging
        this.app.use(httpLogger);

        // Rate Limiting
        this.app.use(generalLimiter);

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        logger.info('Middlewares initialized');
    }

    initializeRoutes() {
        // API routes
        this.app.use('/api/v1', routes);

        // Root route
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                message: 'Event Management System API',
                version: '1.0.0',
                timestamp: new Date().toISOString()
            });
        });

        // Catch-all for undefined routes
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: `Can't find ${req.originalUrl} on this server!`
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

module.exports = new Application();
