import BaseRepository from './BaseRepository.js';

/**
 * Event repository
 * @module repositories
 * @description Event repository for handling event data
 */
class EventRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    /**
     * Find events by profile ID
     * @param {string} profileId - Profile ID
     * @param {number} skip - Skip count
     * @param {number} limit - Limit count
     * @returns {Promise<Object>} Found events
     */
    async findByProfileId(profileId, skip = 0, limit = 10) {
        const query = { profiles: profileId };

        const [data, total] = await Promise.all([
            this.model.find(query)
                .populate('profiles', 'name')
                .sort({ startTime: 1 })
                .skip(skip)
                .limit(limit),
            this.model.countDocuments(query)
        ]);

        return { data, total };
    }

    async findAllEvents(skip = 0, limit = 10) {
        const [data, total] = await Promise.all([
            this.model.find()
                .populate('profiles', 'name')
                .sort({ startTime: 1 })
                .skip(skip)
                .limit(limit),
            this.model.countDocuments()
        ]);

        return { data, total };
    }

    async findByIdWithProfiles(id) {
        return await this.model.findById(id).populate('profiles', 'name');
    }
}

export default EventRepository;
