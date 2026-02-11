class RegisterBattle {
	constructor(battleRepository, userRepository) {
		this.battleRepository = battleRepository;
		this.userRepository = userRepository;
	}

	async execute(battleData) {
		// 1. Salva o histórico
		const history = await this.battleRepository.create(battleData);

		// 2. Se venceu, poderíamos atualizar o level/points do usuário aqui
		// Ex: if (battleData.status === 'victory') { ... }

		return history;
	}
}

module.exports = RegisterBattle;
