const PackageModel = require("../db/models/Package");
const VillainModel = require("../db/models/Villain");
const StoreModel = require("../db/models/Store");
const CardModel = require("../db/models/Card");

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

	async findByIdWithCards(id) {
		const pkg = await PackageModel.findByPk(id, {
			include: [
				{ model: VillainModel, as: "villain" },
				{ model: StoreModel, as: "store" },
			],
		});
		if (!pkg) return null;

		const plainPkg = pkg.get({ plain: true });
		const cardIds = plainPkg.cards || [];
		const cards = cardIds.length > 0
			? await CardModel.findAll({ where: { id: cardIds } })
			: [];

		return {
			...plainPkg,
			cardsData: cards.map(c => ({ card: c.get({ plain: true }) })),
		};
	}

	async deleteById(id) {
		await PackageModel.destroy({ where: { id } });
	}
}

module.exports = SequelizePackageRepository;
