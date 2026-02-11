const VillainModel = require("../db/models/Villain");

class SequelizeVillainRepository {
	async findAll() {
		return await VillainModel.findAll();
	}

	async findById(id) {
		return await VillainModel.findByPk(id);
	}

	async create(villainData) {
		return await VillainModel.create(villainData);
	}
}

module.exports = SequelizeVillainRepository;
