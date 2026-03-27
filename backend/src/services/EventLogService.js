const eventLogRepository = require('../repositories/EventLogRepository');
const { toUserTZ } = require('../utils/timezone');
const { createError } = require('../utils/errorHandler');

class EventLogService {
    async logChanges(eventId, updatedBy, oldEvent, newEventData) {
        const changes = [];

        const fieldsToCheck = ['title', 'timezone', 'startTime', 'endTime', 'profiles'];

        for (const field of fieldsToCheck) {
            let changed = false;
            let oldVal = oldEvent[field];
            let newVal = newEventData[field];

            if (field === 'profiles') {
                const oldIds = (oldVal || []).map(p => (p._id || p.id || p).toString()).sort();
                const newIds = (newVal || []).map(p => p.toString()).sort();
                changed = JSON.stringify(oldIds) !== JSON.stringify(newIds);
            } else if (['startTime', 'endTime'].includes(field)) {
                changed = new Date(oldVal).getTime() !== new Date(newVal).getTime();
            } else {
                changed = oldVal !== newVal;
            }

            if (changed) {
                changes.push({
                    field,
                    oldValue: oldVal,
                    newValue: newVal
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
