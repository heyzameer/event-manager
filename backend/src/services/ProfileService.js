import { createError } from '../utils/errorHandler.js';
import { STATUS_CODES, MESSAGES } from '../utils/constants.js';

/**
 * Profile service
 * @module services
 * @description Profile service for handling profile data
 */
class ProfileService {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }

    /**
     * Create a new profile
     * @param {Object} data - Profile data
     * @returns {Promise<Object>} Created profile
     */
    async createProfile(data) {
        const existing = await this.profileRepository.findByName(data.name);
        if (existing) {
            throw createError(MESSAGES.PROFILE.ALREADY_EXISTS, STATUS_CODES.CONFLICT);
        }

        return await this.profileRepository.create({
            name: data.name,
            timezone: data.timezone || 'UTC'
        });
    }

    /**
     * Get all profiles
     * @returns {Promise<Array<Object>>} All profiles
     */
    async getAllProfiles() {
        return await this.profileRepository.find({}, { createdAt: -1 });
    }
}

export default ProfileService;
