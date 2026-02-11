const ProfilePictureModel = require("../db/models/ProfilePicture");

class SequelizeProfileRepository {
	async findAll(filter = {}) {
		const queryOptions = {};

		if (filter.type) {
			queryOptions.where = { type: filter.type };
		}

		return await ProfilePictureModel.findAll(queryOptions);
	}
}

module.exports = SequelizeProfileRepository;
