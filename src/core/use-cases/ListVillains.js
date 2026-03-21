class ListVillains {
	constructor(villainRepository) {
		this.villainRepository = villainRepository;
	}

	async execute(userId) {
		return await this.villainRepository.findAll(userId);
	}
}

module.exports = ListVillains;
