const { logger } = require('./logger');
const config = require('../config');

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const createError = (message, statusCode = 500) => new AppError(message, statusCode);

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const handleError = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    let { message } = error;

    logger.error(`Error ${statusCode}: ${message}`, {
        stack: error.stack,
        url: req.url,
        method: req.method,
    });

    if (config.env === 'production' && !error.isOperational) {
        message = 'Something went wrong!';
    }

    res.status(statusCode).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
        ...(config.env === 'development' && { stack: error.stack }),
    });
};

module.exports = { AppError, createError, asyncHandler, handleError };
