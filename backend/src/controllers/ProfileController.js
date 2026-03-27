import profileService from '../services/ProfileService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { STATUS_CODES, MESSAGES } from '../utils/constants.js';

/**
 * Profile controller
 * @class
 * @description Profile controller for handling profile req
 */
class ProfileController {
    createProfile = asyncHandler(async (req, res) => {
        const profile = await profileService.createProfile(req.body);
        sendSuccess(res, MESSAGES.PROFILE.CREATED, profile, STATUS_CODES.CREATED);
    });

    getProfiles = asyncHandler(async (req, res) => {
        const profiles = await profileService.getAllProfiles();
        sendSuccess(res, MESSAGES.PROFILE.FETCHED, profiles, STATUS_CODES.SUCCESS);
    });
}

export default new ProfileController();
