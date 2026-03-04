class BuyPackage {
	constructor(userRepository, storePackageRepository, cardRepository, packageRepository, deckRepository) {
		this.userRepository = userRepository;
		this.storePackageRepository = storePackageRepository;
		this.cardRepository = cardRepository;
		this.packageRepository = packageRepository;
		this.deckRepository = deckRepository;
	}

	async execute(userId, storePackageId) {
		const storePackage = await this.storePackageRepository.findById(storePackageId);
		if (!storePackage) throw new Error("Pacote não encontrado");

		const user = await this.userRepository.findById(userId);
		if (!user) throw new Error("Usuário não encontrado");

		if (user.level < storePackage.requiredLevel) {
			throw new Error(`Nível ${storePackage.requiredLevel} necessário para comprar este pacote`);
		}

		if (user.coins < storePackage.price) {
			throw new Error("Moedas insuficientes");
		}

		await this.userRepository.deductCoins(userId, storePackage.price);

		const cards = await this.cardRepository.findRandom(storePackage.cardCount);
		const cardIds = cards.map((c) => c.id);

		const reward = await this.packageRepository.create({
			name: storePackage.name,
			type: "store",
			userId,
			storeId: storePackage.storeId,
			cards: cardIds,
		});

		for (const cardId of cardIds) {
			await this.deckRepository.insertCard({ userId, cardId, type: "library" });
		}

		return {
			package: {
				...reward.toJSON(),
				cardsData: cards.map((c) => ({ cardId: c.id, card: c.toJSON() })),
			},
			coinsSpent: storePackage.price,
		};
	}
}

module.exports = BuyPackage;
