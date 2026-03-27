import { v4 as uuidv4 } from 'uuid';

/**
 * Request ID middleware
 * @module middleware
 * @description Request ID middleware for generating unique request IDs
 */
const requestId = (req, res, next) => {
    const id = req.header('X-Request-Id') || uuidv4();
    req.id = id;
    res.setHeader('X-Request-Id', id);
    next();
};

export default requestId;
