const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
    },
    profiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    }],
    timezone: {
        type: String,
        required: [true, 'Events timezone is required'],
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required'],
    },
    endTime: {
        type: Date,
        required: [true, 'End time is requred'],
    },
    createdBy: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

eventSchema.index({ profiles: 1 });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
