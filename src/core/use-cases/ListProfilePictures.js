class ListProfilePictures {
	constructor(profileRepository) {
		this.profileRepository = profileRepository;
	}

	async execute(type) {
		return await this.profileRepository.findAll({ type });
	}
}

module.exports = ListProfilePictures;
