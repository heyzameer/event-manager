import BaseRepository from './BaseRepository.js';

/**
 * Profile repository
 * @module repositories
 * @description Profile repository for handling profile data
 */
class ProfileRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    /**
     * Find profile by name
     * @param {string} name - Profile name
     * @returns {Promise<Object>} Found profile
     */
    async findByName(name) {
        return await this.model.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });
    }
}

export default ProfileRepository;
