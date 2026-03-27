import rateLimit from 'express-rate-limit';
import config from '../config/index.js';
import { STATUS_CODES, MESSAGES } from '../utils/constants.js';

/**
 * Rate limit middleware
 * @module middleware
 * @description Rate limit middleware for handling rate limiting 
 */
export const generalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
    message: {
        success: false,
        message: MESSAGES.SYSTEM.RATE_LIMIT,
        timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
});
