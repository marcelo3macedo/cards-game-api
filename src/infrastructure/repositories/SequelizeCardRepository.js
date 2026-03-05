const { Op } = require("sequelize");
const CardModel = require("../db/models/Card");
const sequelize = require("#infrastructure/db/sequelize");

class SequelizeCardRepository {
	async findAll(filters = {}) {
		const where = {};

		if (filters.attribute) where.attribute = filters.attribute;
		if (filters.stars) where.stars = filters.stars;
		if (filters.type) where.type = filters.type;

		if (filters.minAtk) {
			where.attackPower = { [Op.gte]: filters.minAtk };
		}

		return await CardModel.findAll({ where });
	}

	async findRandom(count) {
		return await CardModel.findAll({
			order: sequelize.literal("RAND()"),
			limit: count,
		});
	}
}

module.exports = SequelizeCardRepository;
