import helmet from 'helmet';
import compression from 'compression';

/**
 * Security middleware
 * @module middleware
 * @description Security middleware for security header
 */
const securityMiddleware = [
    helmet(),
    compression()
];

export default securityMiddleware;
