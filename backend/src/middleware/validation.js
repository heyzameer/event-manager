import { sendError } from '../utils/response.js';
import { STATUS_CODES, MESSAGES } from '../utils/constants.js';

/**
 * Validation midleware
 * @module middleware
 * @description Validation middleware for handling validation
 */
export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return sendError(res, MESSAGES.VALIDATION.BUILD_FAILED, STATUS_CODES.BAD_REQUEST, errors);
        }

        req.body = value;
        next();
    };
};

export const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return sendError(res, MESSAGES.VALIDATION.QUERY_FAILED, STATUS_CODES.BAD_REQUEST, errors);
        }

        req.query = value;
        next();
    };
};
