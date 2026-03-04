const BattleStorage = require("../../../infrastructure/cache/BattleStorage");

const COINS_PER_VICTORY = 50;

class RegisterBattle {
	constructor(battleRepository, deckRepository, villainRepository, packageRepository, userRepository) {
		this.battleRepository = battleRepository;
		this.deckRepository = deckRepository;
		this.villainRepository = villainRepository;
		this.packageRepository = packageRepository;
		this.userRepository = userRepository;
	}

	async execute(userId) {
		const state = BattleStorage.get(userId);
		if (!state) return;

		const status = state.player.hp > state.opponent.hp ? "victory" : "lose";
		const stars = status === "victory" ? 2 : 0;

		let reward = null;
		let drawnCards = [];

		if (status === "victory") {
			drawnCards = await this.deckRepository.drawRandomCards(state.opponent.id, stars);
			const cardIds = drawnCards.map((entry) => entry.cardId);

			reward = await this.packageRepository.create({
				name: `Recompensa de Duelo`,
				type: "villain",
				userId,
				villainId: state.opponent.id,
				cards: cardIds,
			});

			for (const cardId of cardIds) {
				await this.deckRepository.insertCard({ userId, cardId, type: "library" });
			}
		}

		const battleData = {
			userId,
			villainId: state.opponent.id,
			status,
			stars,
			packageId: reward ? reward.id : null,
		};

		const history = await this.battleRepository.create(battleData);
		const villain = await this.villainRepository.findById(state.opponent.id);

		if (status === "victory") {
			await this.userRepository.addCoins(userId, COINS_PER_VICTORY);
		}

		return {
			history,
			villain,
			package: reward ? {
				...reward.toJSON(),
				cardsData: drawnCards.map(entry => entry.get({ plain: true })),
			} : null,
		};
	}
}

module.exports = RegisterBattle;
