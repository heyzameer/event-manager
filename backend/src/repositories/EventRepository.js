const BaseRepository = require('./BaseRepository');
const Event = require('../models/Event');

class EventRepository extends BaseRepository {
    constructor() {
        super(Event);
    }


    async findByProfileId(profileId) {
        return await this.model.find({ profiles: profileId })
            .populate('profiles', 'name timezone')
            .sort({ startTime: 1 });
    }

    async findByIdWithProfiles(id) {
        return await this.model.findById(id).populate('profiles', 'name timezone');
    }
}

module.exports = new EventRepository();
