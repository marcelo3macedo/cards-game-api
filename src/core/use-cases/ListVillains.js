class ListVillains {
	constructor(villainRepository) {
		this.villainRepository = villainRepository;
	}

	async execute() {
		// Aqui poderíamos adicionar lógica para ordenar por level, por exemplo
		return await this.villainRepository.findAll();
	}
}

module.exports = ListVillains;
