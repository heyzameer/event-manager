const express = require('express');
const router = express.Router();
const profileController = require('../controllers/ProfileController');
const { validate } = require('../middleware/validation');
const { createProfileSchema } = require('../validators/profileValidator');

router.post('/', validate(createProfileSchema), profileController.createProfile);
router.get('/', profileController.getProfiles);

module.exports = router;
