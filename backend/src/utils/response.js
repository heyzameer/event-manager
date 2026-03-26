const sendResponse = (res, statusCode, message, data, error) => {
    res.status(statusCode).json({
        success: statusCode < 400,
        message,
        ...(data !== undefined && { data }),
        ...(error !== undefined && { error }),
        timestamp: new Date().toISOString(),
    });
};

const sendSuccess = (res, message, data, statusCode = 200) => {
    sendResponse(res, statusCode, message, data);
};

const sendError = (res, message, statusCode = 500, error) => {
    sendResponse(res, statusCode, message, undefined, error);
};
module.exports = { sendSuccess, sendError };