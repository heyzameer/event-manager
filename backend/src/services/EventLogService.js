import eventLogRepository from '../repositories/EventLogRepository.js';
import Profile from '../models/Profile.js';
import { toUserTZ } from '../utils/timezone.js';
import { createError } from '../utils/errorHandler.js';
import { STATUS_CODES, MESSAGES } from '../utils/constants.js';
import dayjs from 'dayjs';

/**
 * Event log service
 * @module services
 * @description Event log service for handling even log data
 */
class EventLogService {
    /**
     * Log changes
     * @param {string} eventId - Event ID
     * @param {string} updatedBy - Updated by
     * @param {Object} oldEvent - Old event
     * @param {Object} newEventData - New event data
     * @returns {Promise<void>}
     */
    async logChanges(eventId, updatedBy, oldEvent, newEventData) {
        const changes = [];
        const fieldsToCheck = ['title', 'timezone', 'startTime', 'endTime', 'profiles'];

        for (const field of fieldsToCheck) {
            let change;

            if (field === 'profiles') {
                change = await this._getProfileChanges(oldEvent[field], newEventData[field]);
            } else if (['startTime', 'endTime'].includes(field)) {
                change = this._getDateChanges(field, oldEvent[field], newEventData[field]);
            } else {
                change = this._getValueChanges(field, oldEvent[field], newEventData[field]);
            }

            if (change) changes.push(change);
        }

        if (changes.length > 0) {
            await eventLogRepository.create({ eventId, updatedBy, changes });
        }
    }

    /**
     * Get profile changes
     * @param {Array<Object>} oldVal - Old profile
     * @param {Array<Object>} newVal - New profile
     * @returns {Promise<Object>} Profile changes
     */
    async _getProfileChanges(oldVal, newVal) {
        const oldIds = (oldVal || []).map(p => (p._id || p.id || p).toString()).sort();
        const newIds = (newVal || []).map(p => p.toString()).sort();
        const changed = JSON.stringify(oldIds) !== JSON.stringify(newIds);

        if (!changed) return null;

        const currentProfiles = await Profile.find({ _id: { $in: newVal } });
        const profileNames = currentProfiles.map(p => p.name).join(', ');

        return {
            field: 'profiles',
            oldValue: `${oldIds.length} profiles`,
            newValue: profileNames
        };
    }

    /**
     * Get date changes
     * @param {string} field - Field name
     * @param {Date} oldVal - Old date
     * @param {Date} newVal - New date
     * @returns {Object} Date changes
     */
    _getDateChanges(field, oldVal, newVal) {
        const changed = new Date(oldVal).getTime() !== new Date(newVal).getTime();
        if (!changed) return null;

        return {
            field,
            oldValue: dayjs(oldVal).format('YYYY-MM-DD'),
            newValue: dayjs(newVal).format('YYYY-MM-DD')
        };
    }

    /**
     * Get value changes
     * @param {string} field - Field name
     * @param {*} oldVal - Old value
     * @param {*} newVal - New value
     * @returns {Object} Value changes
     */
    _getValueChanges(field, oldVal, newVal) {
        if (oldVal === newVal) return null;

        return {
            field,
            oldValue: oldVal,
            newValue: newVal
        };
    }

    /**
     * Get logs for event
     * @param {string} eventId - Event ID
     * @param {string} targetTimezone - Target timezone
     * @returns {Promise<Array<Object>>} Event logs
     */
    async getLogsForEvent(eventId, targetTimezone) {
        if (!targetTimezone) {
            throw createError(MESSAGES.EVENT.FETCH_LOGS_ERROR, STATUS_CODES.BAD_REQUEST);
        }

        const logs = await eventLogRepository.findByEventId(eventId);

        return logs.map(log => {
            const logObj = log.toObject();
            logObj.timestamp = toUserTZ(logObj.timestamp, targetTimezone);
            return logObj;
        });
    }
}

export default new EventLogService();
