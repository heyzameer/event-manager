// Centralized API Endpoints
export const ENDPOINTS = {
    PROFILES: '/profiles',
    EVENTS: '/events',
    EVENT_BY_ID: (id) => `/events/${id}`,
    EVENT_LOGS: (id) => `/events/${id}/logs`,
};
