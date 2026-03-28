import BaseRepository from './BaseRepository.js';

/**
 * Event log repository
 * @module repositories
 * @description Event log repository for handling event log data
 */
class EventLogRepository extends BaseRepository {
    constructor(model) {
        super(model);
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

export default EventLogRepository;
