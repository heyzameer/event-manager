const helmet = require('helmet');
const compression = require('compression');

const securityMiddleware = [
    helmet(),
    compression()
];

module.exports = securityMiddleware;
