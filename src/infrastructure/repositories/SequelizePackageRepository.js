const PackageModel = require("../db/models/Package");
const VillainModel = require("../db/models/Villain");
const StoreModel = require("../db/models/Store");

class SequelizePackageRepository {
	async create(packageData) {
		return await PackageModel.create(packageData);
	}

	async findById(id) {
		return await PackageModel.findByPk(id, {
			include: [
				{ model: VillainModel, as: "villain" },
				{ model: StoreModel, as: "store" },
			],
		});
	}

	async findByUserId(userId) {
		return await PackageModel.findAll({
			where: { userId },
			include: [
				{ model: VillainModel, as: "villain" },
				{ model: StoreModel, as: "store" },
			],
			order: [["createdAt", "DESC"]],
		});
	}
}

module.exports = SequelizePackageRepository;
