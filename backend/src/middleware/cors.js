const cors = require('cors');
const config = require('../config');

const corsMiddleware = cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

module.exports = corsMiddleware;
