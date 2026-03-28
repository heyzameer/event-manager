import Joi from 'joi';

// Profile validation schema
export const createProfileSchema = Joi.object({
    name: Joi.string().min(1).max(100).required().messages({
        'string.empty': 'Profiles name cannot be empty',
        'any.required': 'Profile name is required'
    })
});
