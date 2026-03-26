const eventService = require('../services/EventService');
const { sendSuccess } = require('../utils/response');
const { asyncHandler } = require('../utils/errorHandler');

class EventController {
    createEvent = asyncHandler(async (req, res) => {
        const event = await eventService.createEvent(req.body);
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
        const { updatedBy, timezone, ...updateData } = req.body;

        const event = await eventService.updateEvent(id, req.body, updatedBy, timezone);
        sendSuccess(res, 'Event updated successfully', event);
    });
}

module.exports = new EventController();
