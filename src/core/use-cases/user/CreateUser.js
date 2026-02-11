class CreateUser {
	constructor(userRepository) {
		this.userRepository = userRepository;
	}
	async execute(userData) {
		// Aqui você pode gerar o token automaticamente se preferir
		if (!userData.token)
			userData.token = Math.random().toString(36).substring(2);
		return await this.userRepository.create(userData);
	}
}
module.exports = CreateUser;
