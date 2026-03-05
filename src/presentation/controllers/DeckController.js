const ManageDeck = require("#core/use-cases/deck/ManageDeck");
const SequelizeDeckRepository = require("#infrastructure/repositories/SequelizeDeckRepository");

class DeckController {
	constructor() {
		this.deckRepo = new SequelizeDeckRepository();
        this.manageDeck = new ManageDeck(this.deckRepo);
	}

    async myInfo(req, res) {
        try {
            const deckInfo = await this.manageDeck.getPlayerDeckInfo(req.user.id);
            res.json(deckInfo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getInfo(req, res) {
        try {
            const deckInfo = await this.manageDeck.getPlayerDeckInfo(req.params.userId);
            res.json(deckInfo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { cardIds } = req.body;
            if (!Array.isArray(cardIds)) {
                return res.status(400).json({ error: "cardIds deve ser um array." });
            }
            const result = await this.manageDeck.updateMainDeck(req.user.id, cardIds);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async shuffle(req, res) {
        try {
            const shuffledDeck = await this.manageDeck.shuffleAndGetMain(req.params.userId);
            res.json(shuffledDeck);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = DeckController;
