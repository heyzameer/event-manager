const mongoose = require('mongoose');
require('dotenv').config();

const eventSchema = new mongoose.Schema({
    title: String,
    startTime: Date,
    endTime: Date,
    timezone: String
}, { strict: false });

const Event = mongoose.model('Event', eventSchema);

async function dump() {
    await mongoose.connect(process.env.MONGODB_URI);
    const events = await Event.find().sort({ createdAt: -1 }).limit(5);
    
    events.forEach(e => {
        console.log("-------------------");
        console.log("Title:", e.title);
        console.log("StartTime (Stored UTC):", e.startTime.toISOString());
        console.log("StartTime (Raw):", e.startTime);
        console.log("Timezone (Stored):", e.timezone);
    });
    
    await mongoose.disconnect();
}

dump().catch(console.error);
