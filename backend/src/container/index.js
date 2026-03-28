// Repositories
import EventRepository from '../repositories/EventRepository.js';
import ProfileRepository from '../repositories/ProfileRepository.js';
import EventLogRepository from '../repositories/EventLogRepository.js';

// Services
import EventService from '../services/EventService.js';
import ProfileService from '../services/ProfileService.js';
import EventLogService from '../services/EventLogService.js';

// Controllers
import EventController from '../controllers/EventController.js';
import ProfileController from '../controllers/ProfileController.js';
import EventLogController from '../controllers/EventLogController.js';

// Models
import Event from '../models/Event.js';
import Profile from '../models/Profile.js';
import EventLog from '../models/EventLog.js';

// 1. Instantiate Repositories (Inject Models)
const eventRepository = new EventRepository(Event);
const profileRepository = new ProfileRepository(Profile);
const eventLogRepository = new EventLogRepository(EventLog);

// 2. Instantiate Services (Inject Repositories & Models)
const profileService = new ProfileService(profileRepository);
const eventLogService = new EventLogService(eventLogRepository, Profile);
const eventService = new EventService(eventRepository, eventLogService);

// 3. Instantiate Controllers (Inject Services)
const profileController = new ProfileController(profileService);
const eventController = new EventController(eventService);
const eventLogController = new EventLogController(eventLogService);

// Export ready-to-use Controller instances
export {
    profileController,
    eventController,
    eventLogController
};
