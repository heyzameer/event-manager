const eventService = require('../services/EventService');
const { sendSuccess } = require('../utils/response');
const { asyncHandler } = require('../utils/errorHandler');

class EventController {
    createEvent = asyncHandler(async (req, res) => {
        const { startTime, endTime, ...rest } = req.body;
        const data = {
            ...rest,
            startTime: typeof startTime === 'string' ? startTime : new Date(startTime).toISOString(),
            endTime: typeof endTime === 'string' ? endTime : new Date(endTime).toISOString()
        };
        const event = await eventService.createEvent(data);
        sendSuccess(res, 'Event created successfully', event, 201);
    });

    getEvents = asyncHandler(async (req, res) => {
        const { profileId, timezone, page = 1, limit = 10 } = req.query;

        // The service now handles fetching all (if profileId is missing) AND pagination
        const result = await eventService.getEventsForProfile(profileId, timezone, page, limit);

        sendSuccess(res, 'Events retrieved successfully', result);
    });

    getEventById = asyncHandler(async (req, res) => {
        const event = await eventService.getEventById(req.params.id, req.query.timezone);
        sendSuccess(res, 'Event retrieved successfully', event);
    });

    updateEvent = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { startTime, endTime, ...rest } = req.body;
        // Same protection for update: keep startTime/endTime as plain strings
        const body = {
            ...rest,
            startTime: startTime ? (typeof startTime === 'string' ? startTime : new Date(startTime).toISOString()) : undefined,
            endTime: endTime ? (typeof endTime === 'string' ? endTime : new Date(endTime).toISOString()) : undefined
        };
        const { updatedBy, timezone } = body;
        const event = await eventService.updateEvent(id, body, updatedBy, timezone);
        sendSuccess(res, 'Event updated successfully', event);
    });
}

module.exports = new EventController();
