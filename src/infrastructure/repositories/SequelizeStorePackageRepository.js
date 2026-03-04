const StorePackageModel = require("../db/models/StorePackage");

class SequelizeStorePackageRepository {
	async findAll() {
		return await StorePackageModel.findAll({ order: [["requiredLevel", "ASC"]] });
	}

	async findByStoreId(storeId) {
		return await StorePackageModel.findAll({
			where: { storeId },
			order: [["requiredLevel", "ASC"]],
		});
	}

	async findById(id) {
		return await StorePackageModel.findByPk(id);
	}

	async create(data) {
		return await StorePackageModel.create(data);
	}
}

module.exports = SequelizeStorePackageRepository;
