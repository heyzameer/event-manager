import express from 'express';
const router = express.Router();
import { eventController, eventLogController } from '../container.js';
import { validate } from '../middleware/validation.js';
import { createEventSchema, updateEventSchema } from '../validators/eventValidator.js';

// Create event
router.post('/', validate(createEventSchema), eventController.createEvent);

// Get all events
router.get('/', eventController.getEvents);

// Get event by ID
router.get('/:id', eventController.getEventById);

// Update event
router.put('/:id', validate(updateEventSchema), eventController.updateEvent);

// Get event logs
router.get('/:id/logs', eventLogController.getEventLogs);

export default router;
