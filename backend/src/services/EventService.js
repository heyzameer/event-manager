const eventRepository = require('../repositories/EventRepository');
const eventLogService = require('./EventLogService');
const { convertToUTC, toUserTZ } = require('../utils/timezone');
const { createError } = require('../utils/errorHandler');

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

    async getEventsForProfile(profileId, targetTimezone) {
        if (!targetTimezone) throw createError('targetTimezone is required', 400);

        const events = await eventRepository.findByProfileId(profileId);

        return events.map(event => this._formatEventForResponse(event, targetTimezone));
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

        const updatedEvent = await eventRepository.update(id, updateData);

        return this._formatEventForResponse(updatedEvent, targetTimezone);
    }
}

module.exports = new EventService();
