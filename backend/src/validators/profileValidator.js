const Joi = require('joi');

const createProfileSchema = Joi.object({
    name: Joi.string().min(1).max(100).required().messages({
        'string.empty': 'Profiles name cannot be empty',
        'any.required': 'Profile name is required'
    }),
    timezone: Joi.string().optional()
});

module.exports = {
    createProfileSchema
};
