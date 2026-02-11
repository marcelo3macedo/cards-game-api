class ManageDeck {
	constructor(deckRepository) {
		this.deckRepository = deckRepository;
	}

	async getPlayerDeckInfo(userId) {
		const mainDeck = await this.deckRepository.findByUserAndType(
			userId,
			"main",
		);
		const library = await this.deckRepository.findByUserAndType(
			userId,
			"library",
		);

		return {
			mainDeck,
			library,
			mainCount: mainDeck.length,
			libraryCount: library.length,
		};
	}

	async shuffleAndGetMain(userId) {
		return await this.deckRepository.shuffleMainDeck(userId);
	}
}

module.exports = ManageDeck;
