const BattleHistoryModel = require("../db/models/BattleHistory");
const VillainModel = require("../db/models/Villain");

class SequelizeBattleRepository {
	async create(battleData) {
		return await BattleHistoryModel.create(battleData);
	}

	async findByUserId(userId) {
		return await BattleHistoryModel.findAll({
			where: { userId },
			include: [{ model: VillainModel, as: "villain" }],
			order: [["date", "DESC"]], // Mais recentes primeiro
		});
	}
}

module.exports = SequelizeBattleRepository;
