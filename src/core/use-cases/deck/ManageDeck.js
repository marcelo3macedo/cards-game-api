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

	async updateMainDeck(userId, cardIds) {
		if (!Array.isArray(cardIds) || cardIds.length < 35 || cardIds.length > 45) {
			throw new Error("O deck deve ter entre 35 e 45 cartas.");
		}
		await this.deckRepository.updateMainDeck(userId, cardIds);
		return { success: true, count: cardIds.length };
	}

	async shuffleAndGetMain(userId) {
		return await this.deckRepository.shuffleMainDeck(userId);
	}
}

module.exports = ManageDeck;
