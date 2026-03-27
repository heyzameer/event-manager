import BaseRepository from './BaseRepository.js';
import Profile from '../models/Profile.js';

/**
 * Profile repository
 * @module repositories
 * @description Profile repository for handling profile data
 */
class ProfileRepository extends BaseRepository {
    constructor() {
        super(Profile);
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

export default new ProfileRepository();
