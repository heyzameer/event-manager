const eventLogService = require('../services/EventLogService');
const { sendSuccess } = require('../utils/response');
const { asyncHandler } = require('../utils/errorHandler');

class EventLogController {
    getEventLogs = asyncHandler(async (req, res) => {
        const { id } = req.params; // Event ID
        const { timezone } = req.query; // requested timezone

        const logs = await eventLogService.getLogsForEvent(id, timezone);
        sendSuccess(res, 'Event logs retrieved successfully', logs);
    });
}

module.exports = new EventLogController();
