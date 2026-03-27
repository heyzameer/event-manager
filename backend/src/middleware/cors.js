import cors from 'cors';
import config from '../config/index.js';

/**
 * Cors middleware
 * @module middleware
 * @description CORS middleware for handling cross origin request
 */
const corsMiddleware = cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

export default corsMiddleware;
