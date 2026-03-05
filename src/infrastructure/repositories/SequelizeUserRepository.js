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

	async findById(id) {
		return await UserModel.findByPk(id, {
			include: [{ model: ProfilePictureModel, as: "profile" }],
		});
	}

	async deductCoins(userId, amount) {
		const user = await UserModel.findByPk(userId);
		if (!user) throw new Error("Usuário não encontrado");
		if (user.coins < amount) throw new Error("Moedas insuficientes");
		user.coins -= amount;
		await user.save();
		return user;
	}

	async addCoins(userId, amount) {
		const user = await UserModel.findByPk(userId);
		if (!user) throw new Error("Usuário não encontrado");
		user.coins += amount;
		await user.save();
		return user;
	}
}

module.exports = SequelizeUserRepository;
