const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    updatedBy: {
        type: String,
        required: true,
    },
    changes: [{
        field: { type: String, required: true },
        oldValue: { type: mongoose.Schema.Types.Mixed },
        newValue: { type: mongoose.Schema.Types.Mixed },
    }],
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

eventLogSchema.index({ eventId: 1 });

const EventLog = mongoose.model('EventLog', eventLogSchema);
module.exports = EventLog;
