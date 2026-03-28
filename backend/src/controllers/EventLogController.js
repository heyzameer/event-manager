import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { STATUS_CODES, MESSAGES } from '../utils/constants.js';

/**
 * Event log controller
 * @class
 * @description Event log controller for handling event logs req
 */
class EventLogController {
    constructor(eventLogService) {
        this.eventLogService = eventLogService;
    }

    getEventLogs = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { timezone } = req.query;

        const logs = await this.eventLogService.getLogsForEvent(id, timezone);
        sendSuccess(res, MESSAGES.EVENT.FETCHED, logs, STATUS_CODES.SUCCESS);
    });
}

export default EventLogController;
