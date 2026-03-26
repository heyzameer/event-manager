const BaseRepository = require('./BaseRepository');
const Event = require('../models/Event');

class EventRepository extends BaseRepository {
    constructor() {
        super(Event);
    }

    async findByProfileId(profileId, skip = 0, limit = 10) {
        const query = { profiles: profileId };

        const [data, total] = await Promise.all([
            this.model.find(query)
                .populate('profiles', 'name timezone')
                .sort({ startTime: 1 })
                .skip(skip)
                .limit(limit),
            this.model.countDocuments(query)
        ]);

        return { data, total };
    }

    //with pagination
    async findAllEvents(skip = 0, limit = 10) {
        const [data, total] = await Promise.all([
            this.model.find()
                .populate('profiles', 'name timezone')
                .sort({ startTime: 1 })
                .skip(skip)
                .limit(limit),
            this.model.countDocuments()
        ]);

        return { data, total };
    }

    async findByIdWithProfiles(id) {
        return await this.model.findById(id).populate('profiles', 'name timezone');
    }
}

module.exports = new EventRepository();
