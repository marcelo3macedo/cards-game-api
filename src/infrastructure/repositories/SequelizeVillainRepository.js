const VillainModel = require("../db/models/Villain");
const ChapterModel = require("../db/models/Chapter");
const BattleHistory = require("../db/models/BattleHistory");

class SequelizeVillainRepository {
	async findAll(userId) {
		const [villains, victories] = await Promise.all([
			VillainModel.findAll({
				include: [
					{
						model: ChapterModel,
						as: "chapter",
						include: [
							{
								model: VillainModel,
								as: "unlockVillain",
								attributes: ["id", "name"],
							},
						],
					},
				],
				order: [
					[{ model: ChapterModel, as: "chapter" }, "id", "ASC"],
					["level", "ASC"],
				],
			}),
			userId
				? BattleHistory.findAll({
						where: { userId, status: "victory" },
						attributes: ["villainId"],
					})
				: Promise.resolve([]),
		]);

		const defeatedIds = new Set(victories.map((v) => v.villainId));

		return villains.map((villain) => {
			const plain = villain.toJSON();
			if (plain.chapter) {
				plain.chapter.isUnlocked =
					!plain.chapter.unlockVillainId ||
					defeatedIds.has(plain.chapter.unlockVillainId);
			}
			return plain;
		});
	}

	async findById(id) {
		return await VillainModel.findByPk(id);
	}

	async create(villainData) {
		return await VillainModel.create(villainData);
	}
}

module.exports = SequelizeVillainRepository;
