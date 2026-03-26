const express = require('express');
const router = express.Router();
const eventController = require('../controllers/EventController');
const eventLogController = require('../controllers/EventLogController');
const { validate } = require('../middleware/validation');
const { createEventSchema, updateEventSchema } = require('../validators/eventValidator');

router.post('/', validate(createEventSchema), eventController.createEvent);

router.get('/', eventController.getEvents);

router.get('/:id', eventController.getEventById);

router.put('/:id', validate(updateEventSchema), eventController.updateEvent);

router.get('/:id/logs', eventLogController.getEventLogs);

module.exports = router;
