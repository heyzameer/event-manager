const morgan = require('morgan');
const { logger } = require('../utils/logger');

const logFormat = ':remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms';

const httpLogger = morgan(logFormat, {
    stream: {
        write: (message) => {
            logger.info(message.trim());
        },
    },
});

module.exports = httpLogger;
