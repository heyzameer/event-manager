import { STATUS_CODES } from './constants.js';

const sendResponse = (res, statusCode, message, data, error) => {
    res.status(statusCode).json({
        success: statusCode < 400,
        message,
        ...(data !== undefined && { data }),
        ...(error !== undefined && { error }),
        timestamp: new Date().toISOString(),
    });
};

export const sendSuccess = (res, message, data, statusCode = STATUS_CODES.SUCCESS) => {
    sendResponse(res, statusCode, message, data);
};

export const sendError = (res, message, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, error) => {
    sendResponse(res, statusCode, message, undefined, error);
};