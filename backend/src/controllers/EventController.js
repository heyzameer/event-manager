import eventService from '../services/EventService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { STATUS_CODES, MESSAGES } from '../utils/constants.js';

/**
 * Event controller
 * @class
 * @description Event controller for handling event request
 */
class EventController {
    createEvent = asyncHandler(async (req, res) => {
        const { startTime, endTime, ...rest } = req.body;
        const data = {
            ...rest,
            startTime: typeof startTime === 'string' ? startTime : new Date(startTime).toISOString(),
            endTime: typeof endTime === 'string' ? endTime : new Date(endTime).toISOString()
        };
        const event = await eventService.createEvent(data);
        sendSuccess(res, MESSAGES.EVENT.CREATED, event, STATUS_CODES.CREATED);
    });

    getEvents = asyncHandler(async (req, res) => {
        const { profileId, timezone, page = 1, limit = 10 } = req.query;

        const result = await eventService.getEventsForProfile(profileId, timezone, page, limit);

        sendSuccess(res, MESSAGES.EVENT.FETCHED, result, STATUS_CODES.SUCCESS);
    });

    getEventById = asyncHandler(async (req, res) => {
        const event = await eventService.getEventById(req.params.id, req.query.timezone);
        sendSuccess(res, MESSAGES.EVENT.FETCHED, event, STATUS_CODES.SUCCESS);
    });

    updateEvent = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { startTime, endTime, ...rest } = req.body;
        const body = {
            ...rest,
            startTime: startTime ? (typeof startTime === 'string' ? startTime : new Date(startTime).toISOString()) : undefined,
            endTime: endTime ? (typeof endTime === 'string' ? endTime : new Date(endTime).toISOString()) : undefined
        };
        const { updatedBy, timezone } = body;
        const event = await eventService.updateEvent(id, body, updatedBy, timezone);
        sendSuccess(res, MESSAGES.EVENT.UPDATED, event, STATUS_CODES.SUCCESS);
    });
}

export default new EventController();
