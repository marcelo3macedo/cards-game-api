const BattleHistoryModel = require("../db/models/BattleHistory");
const PackageModel = require("../db/models/Package");
const VillainModel = require("../db/models/Villain");

class SequelizeBattleRepository {
	async create(battleData) {
		return await BattleHistoryModel.create(battleData);
	}

	async findByUserId(userId) {
		return await BattleHistoryModel.findAll({
			where: { userId },
			include: [
				{ model: VillainModel, as: "villain" },
				{ model: PackageModel, as: "package" },
			],
			order: [["date", "DESC"]],
		});
	}
}

module.exports = SequelizeBattleRepository;
