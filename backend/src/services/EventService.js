const eventRepository = require('../repositories/EventRepository');
const eventLogService = require('./EventLogService');
const { convertToUTC, toUserTZ } = require('../utils/timezone');
const { createError } = require('../utils/errorHandler');
const { logger } = require('../utils/logger');

class EventService {

    _formatEventForResponse(event, targetTimezone) {
        const eventObj = event.toObject ? event.toObject() : event;

        eventObj.startTime = toUserTZ(eventObj.startTime, targetTimezone);
        eventObj.endTime = toUserTZ(eventObj.endTime, targetTimezone);
        eventObj.createdAt = toUserTZ(eventObj.createdAt, targetTimezone);
        eventObj.updatedAt = toUserTZ(eventObj.updatedAt, targetTimezone);

        return eventObj;
    }

    async createEvent(data) {
        logger.info('DEBUG: createEvent data: ' + JSON.stringify(data));

        const utcStart = convertToUTC(data.startTime, data.timezone);
        const utcEnd = convertToUTC(data.endTime, data.timezone);

        if (utcEnd <= utcStart) {
            throw createError('End time must be after start time', 400);
        }

        const newEvent = await eventRepository.create({
            ...data,
            startTime: utcStart,
            endTime: utcEnd
        });

        return this._formatEventForResponse(newEvent, data.timezone);
    }

    async getEventsForProfile(profileId, targetTimezone, page = 1, limit = 10) {
        if (!targetTimezone) throw createError('targetTimezone is required', 400);

        const skip = (page - 1) * limit;

        // If profileId is provided, filter by it our fetch all.
        let result;
        if (profileId) {
            result = await eventRepository.findByProfileId(profileId, skip, limit);
        } else {
            result = await eventRepository.findAllEvents(skip, limit);
        }

        const events = result.data.map(event => this._formatEventForResponse(event, targetTimezone));

        return {
            events,
            pagination: {
                total: result.total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(result.total / limit)
            }
        };
    }

    async getEventById(id, targetTimezone) {
        if (!targetTimezone) throw createError('targetTimezone is required', 400);

        const event = await eventRepository.findByIdWithProfiles(id);
        if (!event) throw createError('Event not found', 404);

        return this._formatEventForResponse(event, targetTimezone);
    }

    async updateEvent(id, data, updatedBy, targetTimezone) {
        if (!targetTimezone) throw createError('targetTimezone is required for update logs', 400);

        const oldEvent = await eventRepository.findById(id);
        if (!oldEvent) throw createError('Event not found', 404);

        const updateData = { ...data };

        if (data.startTime && data.timezone) {
            updateData.startTime = convertToUTC(data.startTime, data.timezone);
        }
        if (data.endTime && data.timezone) {
            updateData.endTime = convertToUTC(data.endTime, data.timezone);
        }

        const finalStart = updateData.startTime || oldEvent.startTime;
        const finalEnd = updateData.endTime || oldEvent.endTime;
        if (finalEnd <= finalStart) {
            throw createError('End time must be after start time', 400);
        }

        await eventLogService.logChanges(id, updatedBy, oldEvent, updateData);

        const updatedEvent = await eventRepository.update(id, { ...updateData, updatedBy });

        return this._formatEventForResponse(updatedEvent, targetTimezone);
    }
}

module.exports = new EventService();
