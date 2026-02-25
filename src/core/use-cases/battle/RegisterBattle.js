const BattleStorage = require("../../../infrastructure/cache/BattleStorage");

class RegisterBattle {
	constructor(battleRepository, deckRepository, villainRepository) {
		this.battleRepository = battleRepository;
		this.deckRepository = deckRepository;
		this.villainRepository = villainRepository;
	}

	async execute(userId) {
		const state = BattleStorage.get(userId);
		if (!state) return;

		const status  = state.player.hp > state.opponent.hp ? "victory" : "lose";
		const stars = 2;
		const cardsAcquired = status === "victory"
			? await this.deckRepository.drawRandomCards(state.opponent.id, stars)
			: [];

		const battleData = {
			userId,
			villainId: state.opponent.id,
			status,
			stars,
			cardsAcquired
		}

		const history = await this.battleRepository.create(battleData);
		const villain = await this.villainRepository.findById(state.opponent.id);

		if (cardsAcquired.length > 0) {
			for (const item of cardsAcquired) {
				await this.deckRepository.insertCard({
					userId,
					cardId: item.cardId,
					type: "library",
				});
			}
		}

		return {
			history,
			villain
		};
	}
}

module.exports = RegisterBattle;
