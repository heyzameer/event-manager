const profileService = require('../services/ProfileService');
const { sendSuccess } = require('../utils/response');
const { asyncHandler } = require('../utils/errorHandler');

class ProfileController {
    createProfile = asyncHandler(async (req, res) => {
        const profile = await profileService.createProfile(req.body);
        sendSuccess(res, 'Profile created successfully', profile, 201);
    });

    getProfiles = asyncHandler(async (req, res) => {
        const profiles = await profileService.getAllProfiles();
        sendSuccess(res, 'Profiles retrieved successfuly', profiles);
    });
}

module.exports = new ProfileController();
