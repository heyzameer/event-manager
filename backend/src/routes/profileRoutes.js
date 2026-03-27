import express from 'express';
const router = express.Router();
import profileController from '../controllers/ProfileController.js';
import { validate } from '../middleware/validation.js';
import { createProfileSchema } from '../validators/profileValidator.js';

// Create profile
router.post('/', validate(createProfileSchema), profileController.createProfile);

// Get all profiles
router.get('/', profileController.getProfiles);

export default router;
