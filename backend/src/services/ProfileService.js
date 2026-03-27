import profileRepository from '../repositories/ProfileRepository.js';
import { createError } from '../utils/errorHandler.js';
import { STATUS_CODES, MESSAGES } from '../utils/constants.js';

/**
 * Profile service
 * @module services
 * @description Profile service for handling profile data
 */
class ProfileService {
    /**
     * Create a new profile
     * @param {Object} data - Profile data
     * @returns {Promise<Object>} Created profile
     */
    async createProfile(data) {
        const existing = await profileRepository.findByName(data.name);
        if (existing) {
            throw createError(MESSAGES.PROFILE.ALREADY_EXISTS, STATUS_CODES.CONFLICT);
        }

        return await profileRepository.create({
            name: data.name,
            timezone: data.timezone || 'UTC'
        });
    }

    /**
     * Get all profiles
     * @returns {Promise<Array<Object>>} All profiles
     */
    async getAllProfiles() {
        return await profileRepository.find({}, { createdAt: -1 });
    }
}

export default new ProfileService();
