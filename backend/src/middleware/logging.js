import morgan from 'morgan';
import { logger } from '../utils/logger.js';

morgan.token('id', (req) => req.id);

const logFormat = '[:id] :remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms';

/**
 * HTTP logger middleware
 * @module middleware
 * @description HTTP logger middleware for logging req and res
 */
const httpLogger = morgan(logFormat, {
    stream: {
        write: (message) => {
            logger.info(message.trim());
        },
    },
});

export default httpLogger;
