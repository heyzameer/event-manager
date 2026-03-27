export const STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
    EVENT: {
        CREATED: 'Event created successfully',
        UPDATED: 'Event updated successfully',
        FETCHED: 'Events retrieved successfully',
        NOT_FOUND: 'Event not found',
        FETCH_LOGS_ERROR: 'targettimezone is required to view logs',
        INVALID_RANGE: 'End time must be after start time',
        TZ_REQUIRED: 'targettimezone is required',
    },
    PROFILE: {
        CREATED: 'Profile created successfully',
        FETCHED: 'Profiles retrieved successfully',
        NOT_FOUND: 'Profile not found',
        ALREADY_EXISTS: 'A profile with this name already exists',
    },
    VALIDATION: {
        BUILD_FAILED: 'Validation failed',
        QUERY_FAILED: 'Query validation failed',
    },
    SYSTEM: {
        HEALTH: 'Event Management System API is running',
        NOT_FOUND: 'Can\'t find the requested resource on this server!',
        RATE_LIMIT: 'Too many requests from this IP, please try again later.',
        ERROR: 'Something went wrong!',
    }
};
