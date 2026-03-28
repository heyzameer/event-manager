import Joi from 'joi';

// Event validation schema
export const createEventSchema = Joi.object({
    title: Joi.string().min(1).max(200).required(),

    profiles: Joi.array().items(
        Joi.string().hex().length(24).required()
    ).min(1).required().messages({
        'array.min': 'At least one profile must be selected'
    }),

    timezone: Joi.string().required(),

    startTime: Joi.string().required(),
    endTime: Joi.string().required(),

    createdBy: Joi.string().required()
});

// Update event validation schema
export const updateEventSchema = Joi.object({
    title: Joi.string().min(1).max(200).optional(),

    profiles: Joi.array().items(
        Joi.string().hex().length(24)
    ).min(1).optional(),

    timezone: Joi.string().optional(),

    startTime: Joi.string().optional(),

    endTime: Joi.string().optional(),

    updatedBy: Joi.string().required()
}).min(2);
