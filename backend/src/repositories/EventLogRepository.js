const BaseRepository = require('./BaseRepository');
const EventLog = require('../models/EventLog');

class EventLogRepository extends BaseRepository {
    constructor() {
        super(EventLog);
    }

    async findByEventId(eventId) {
        return await this.model.find({ eventId }).sort({ timestamp: -1 });
    }
}

module.exports = new EventLogRepository();
