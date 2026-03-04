const StoreModel = require("../db/models/Store");

class SequelizeStoreRepository {
	async findAll() {
		return await StoreModel.findAll();
	}

	async findById(id) {
		return await StoreModel.findByPk(id);
	}

	async create(storeData) {
		return await StoreModel.create(storeData);
	}
}

module.exports = SequelizeStoreRepository;
