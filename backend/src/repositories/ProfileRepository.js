const BaseRepository = require('./BaseRepository');
const Profile = require('../models/Profile');

class ProfileRepository extends BaseRepository {
    constructor() {
        super(Profile);
    }

    async findByName(name) {
        return await this.model.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });
    }
}

module.exports = new ProfileRepository();
