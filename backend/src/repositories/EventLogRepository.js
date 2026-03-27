import BaseRepository from './BaseRepository.js';
import EventLog from '../models/EventLog.js';

/**
 * Event log repository
 * @module repositories
 * @description Event log repository for handling event log data
 */
class EventLogRepository extends BaseRepository {
    constructor() {
        super(EventLog);
    }

    /**
     * Find event logs by event ID
     * @param {string} eventId - Event ID
     * @returns {Promise<Array<Object>>} Found event logs
     */
    async findByEventId(eventId) {
        return await this.model.find({ eventId }).sort({ timestamp: -1 });
    }
}

export default new EventLogRepository();
