import { convertToUTC } from '../utils/timezone.js';
import { createError } from '../utils/errorHandler.js';
import { logger } from '../utils/logger.js';
import { STATUS_CODES, MESSAGES } from '../utils/constants.js';

/**
 * Event service
 * @module services
 * @description Event service for handling event dataa
 */
class EventService {
    constructor(eventRepository, eventLogService) {
        this.eventRepository = eventRepository;
        this.eventLogService = eventLogService;
    }

    _formatEventForResponse(event) {
        return event.toObject ? event.toObject() : event;
    }

    async createEvent(data) {
        logger.info('DEBUG: createEvent data: ' + JSON.stringify(data));

        const utcStart = convertToUTC(data.startTime, data.timezone);
        const utcEnd = convertToUTC(data.endTime, data.timezone);

        if (utcEnd <= utcStart) {
            throw createError(MESSAGES.EVENT.INVALID_RANGE, STATUS_CODES.BAD_REQUEST);
        }

        const newEvent = await this.eventRepository.create({
            ...data,
            startTime: utcStart,
            endTime: utcEnd
        });

        return this._formatEventForResponse(newEvent, data.timezone);
    }

    async getEventsForProfile(profileId, targetTimezone, page = 1, limit = 10) {
        if (!targetTimezone) throw createError(MESSAGES.EVENT.TZ_REQUIRED, STATUS_CODES.BAD_REQUEST);

        const skip = (page - 1) * limit;

        let result;
        if (profileId) {
            result = await this.eventRepository.findByProfileId(profileId, skip, limit);
        } else {
            result = await this.eventRepository.findAllEvents(skip, limit);
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
        if (!targetTimezone) throw createError(MESSAGES.EVENT.TZ_REQUIRED, STATUS_CODES.BAD_REQUEST);

        const event = await this.eventRepository.findByIdWithProfiles(id);
        if (!event) throw createError(MESSAGES.EVENT.NOT_FOUND, STATUS_CODES.NOT_FOUND);

        return this._formatEventForResponse(event, targetTimezone);
    }

    async updateEvent(id, data, updatedBy, targetTimezone) {
        if (!targetTimezone) throw createError(MESSAGES.EVENT.FETCH_LOGS_ERROR, STATUS_CODES.BAD_REQUEST);

        const oldEvent = await this.eventRepository.findById(id);
        if (!oldEvent) throw createError(MESSAGES.EVENT.NOT_FOUND, STATUS_CODES.NOT_FOUND);

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
            throw createError(MESSAGES.EVENT.INVALID_RANGE, STATUS_CODES.BAD_REQUEST);
        }

        await this.eventLogService.logChanges(id, updatedBy, oldEvent, updateData);

        const updatedEvent = await this.eventRepository.update(id, { ...updateData, updatedBy });

        return this._formatEventForResponse(updatedEvent, targetTimezone);
    }
}

export default EventService;
