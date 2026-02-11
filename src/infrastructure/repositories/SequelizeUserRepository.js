const UserModel = require("../db/models/User");
const ProfilePictureModel = require("../db/models/ProfilePicture");

class SequelizeUserRepository {
	async create(userData) {
		return await UserModel.create(userData);
	}

	async findByToken(token) {
		return await UserModel.findOne({
			where: { token, active: true },
			include: [{ model: ProfilePictureModel, as: "profile" }],
		});
	}
}

module.exports = SequelizeUserRepository;
