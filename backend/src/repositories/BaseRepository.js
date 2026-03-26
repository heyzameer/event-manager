class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const document = new this.model(data);
        return await document.save();
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findOne(filter) {
        return await this.model.findOne(filter);
    }

    async find(filter = {}, sort = { createdAt: -1 }) {
        return await this.model.find(filter).sort(sort);
    }

    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}

module.exports = BaseRepository;
