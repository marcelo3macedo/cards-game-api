const ListCards = require("../../core/use-cases/ListCards");

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
}

module.exports = CardController;
