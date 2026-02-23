const VillainTurnEngine = require("#core/services/villain/VillainTurnEngine");
const BattleStorage = require("#infrastructure/cache/BattleStorage");

class VillainTurn {
	async execute(userId) {
		const allActions = [];
		let state = BattleStorage.get(userId);
		if (!state || state.currentTurnOwner !== "opponent") {
			throw new Error("Não é o turno do vilão ou batalha não encontrada.");
		}

		const drawResult = await VillainTurnEngine.drawPhrase({ userId, state });
		state = drawResult.state;
        allActions.push(...drawResult.actions);

		const summonResult = await VillainTurnEngine.summonPhrase({ userId, state });
		state = summonResult.state;
        allActions.push(...summonResult.actions);

		const attackResult = await VillainTurnEngine.attackPhrase({ userId, state });
		state = attackResult.state;
        allActions.push(...attackResult.actions);

		state = VillainTurnEngine.passTurnToPlayer({ state });

		BattleStorage.save(userId, state);
		return { state, logs: [], actions: allActions };
	}
}

module.exports = VillainTurn;
