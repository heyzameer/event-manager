import { logger } from './logger.js';
import config from '../config/index.js';
import { STATUS_CODES, MESSAGES } from './constants.js';

/**
 * Error handling utilities
 * @module utils
 * @description Error handling utilities for the applicatinon
 */
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const createError = (message, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR) => new AppError(message, statusCode);

export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const handleError = (error, req, res, _next) => {
    const statusCode = error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    let { message } = error;

    logger.error(`Error ${statusCode}: ${message}`, {
        stack: error.stack,
        url: req.url,
        method: req.method,
    });

    if (config.env === 'production' && !error.isOperational) {
        message = MESSAGES.SYSTEM.ERROR;
    }

    res.status(statusCode).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
        ...(config.env === 'development' && { stack: error.stack }),
    });
};
