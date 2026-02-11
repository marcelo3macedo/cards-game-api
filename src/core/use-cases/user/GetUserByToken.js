class GetUserByToken {
	constructor(userRepository) {
		this.userRepository = userRepository;
	}
	async execute(token) {
		const user = await this.userRepository.findByToken(token);
		if (!user) throw new Error("User not found or inactive");
		return user;
	}
}
module.exports = GetUserByToken;
