/**
 * Base repository
 * @module repositories
 * @description Base repository for handling database operations
 */
class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    /**
     * Create a new document
     * @param {Object} data - Document data
     * @returns {Promise<Object>} Created document
     */
    async create(data) {
        const document = new this.model(data);
        return await document.save();
    }

    /**
     * Find document by ID
     * @param {string} id - Document ID
     * @returns {Promise<Object>} Found document
     */
    async findById(id) {
        return await this.model.findById(id);
    }

    /**
     * Find one document by filter
     * @param {Object} filter - Filter criteria
     * @returns {Promise<Object>} Found document
     */
    async findOne(filter) {
        return await this.model.findOne(filter);
    }

    /**
     * Find documents by filter
     * @param {Object} filter - Filter criteria
     * @param {Object} sort - Sort criteria
     * @returns {Promise<Array<Object>>} Found documents
     */
    async find(filter = {}, sort = { createdAt: -1 }) {
        return await this.model.find(filter).sort(sort);
    }

    /**
     * Update document by ID
     * @param {string} id - Document ID
     * @param {Object} data - Document data
     * @returns {Promise<Object>} Updated document
     */
    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete document by ID
     * @param {string} id - Document ID
     * @returns {Promise<Object>} Deleted document
     */
    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}

export default BaseRepository;
