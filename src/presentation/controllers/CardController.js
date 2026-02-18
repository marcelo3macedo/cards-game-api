const BattleAction = require("#core/use-cases/battle/BattleAction");
const ListCards = require("#core/use-cases/ListCards");

class CardController {
	constructor(cardRepository) {
		this.cardRepository = cardRepository;
	}

	async handleList(req, res) {
		try {
			const useCase = new ListCards(this.cardRepository);
			const cards = await useCase.execute();
			res.json(cards);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async changePosition(req, res) {
		try {
			const { fieldIndex, position } = req.body;

			if (fieldIndex === undefined) {
				throw new Error("fieldIndex is required");
			}

			const action = new BattleAction();
			const newState = action.changePosition(req.user.id, fieldIndex, position);
			res.json(newState);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async activate(req, res) {
		try {
			const { cardIndex, origin } = req.body;

			const action = new BattleAction();
			const activationResult = await action.prepareEffect(req.user.id, cardIndex, origin, "player");

			res.status(200).json(activationResult);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async confirmSelection(req, res) {
		try {
			const { handIndex, effectType, target } = req.body;

			const action = new BattleAction();
			const result = action.executeEffect(req.user.id, {
				handIndex,
				effectType,
				target
			});

			res.json(result);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = CardController;
