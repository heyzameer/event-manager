const profileRepository = require('../repositories/ProfileRepository');
const { createError } = require('../utils/errorHandler');

class ProfileService {
    async createProfile(data) {
        const existing = await profileRepository.findByName(data.name);
        if (existing) {
            throw createError('A profile with this name already exists', 409);
        }

        return await profileRepository.create({
            name: data.name,
            timezone: data.timezone || 'UTC'
        });
    }

    async getAllProfiles() {
        return await profileRepository.find({}, { createdAt: -1 });
    }
}

module.exports = new ProfileService();
