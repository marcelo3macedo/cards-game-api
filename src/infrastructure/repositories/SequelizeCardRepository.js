const { Op } = require("sequelize");
const CardModel = require("../db/models/Card");

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
}

module.exports = SequelizeCardRepository;
