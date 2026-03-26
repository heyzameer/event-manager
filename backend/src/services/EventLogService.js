const eventLogRepository = require('../repositories/EventLogRepository');
const { toUserTZ } = require('../utils/timezone');
const { createError } = require('../utils/errorHandler');

class EventLogService {
    async logChanges(eventId, updatedBy, oldEvent, newEventData) {
        const changes = [];

        const fieldsToCheck = ['title', 'timezone', 'startTime', 'endTime'];

        for (const field of fieldsToCheck) {
            if (newEventData[field] && newEventData[field] !== oldEvent[field]?.toISOString?.() && newEventData[field] !== oldEvent[field]) {
                changes.push({
                    field,
                    oldValue: oldEvent[field],
                    newValue: newEventData[field]
                });
            }
        }

        if (changes.length > 0) {
            await eventLogRepository.create({
                eventId,
                updatedBy,
                changes
            });
        }
    }

    async getLogsForEvent(eventId, targetTimezone) {
        if (!targetTimezone) {
            throw createError('targetTimezone is required to view logs', 400);
        }

        const logs = await eventLogRepository.findByEventId(eventId);

        return logs.map(log => {
            const logObj = log.toObject();
            logObj.timestamp = toUserTZ(logObj.timestamp, targetTimezone);
            return logObj;
        });
    }
}

module.exports = new EventLogService();
