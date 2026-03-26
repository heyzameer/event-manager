const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Profile name is required'],
        trim: true,
        unique: true,
    },
    timezone: {
        type: String,
        required: [true, 'Timezone is required'],
        default: 'UTC',
    }
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
