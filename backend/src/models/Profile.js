import mongoose from 'mongoose';

/**
 * Profile schema
 * @module models
 * @description Profile schema for storing profile data
 */
const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Profile name is required'],
        trim: true,
        unique: true,
    }
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
