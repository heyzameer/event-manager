const Joi = require('joi');

const createEventSchema = Joi.object({
    title: Joi.string().min(1).max(200).required(),

    profiles: Joi.array().items(
        Joi.string().hex().length(24).required()
    ).min(1).required().messages({
        'array.min': 'At least one profile must be selected'
    }),

    timezone: Joi.string().required(),

    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().greater(Joi.ref('startTime')).required().messages({
        'date.greater': 'End time cannot be before or equal to start time'
    }),

    createdBy: Joi.string().required()
});

const updateEventSchema = Joi.object({
    title: Joi.string().min(1).max(200).optional(),

    profiles: Joi.array().items(
        Joi.string().hex().length(24)
    ).min(1).optional(),

    timezone: Joi.string().optional(),

    startTime: Joi.date().iso().optional(),

    endTime: Joi.date().iso().when('startTime', {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref('startTime')),
        otherwise: Joi.date()
    }).optional(),

    updatedBy: Joi.string().required()
}).min(2);

module.exports = {
    createEventSchema,
    updateEventSchema
};
