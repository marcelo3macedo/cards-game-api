const DeckModel = require("../db/models/Deck");
const CardModel = require("../db/models/Card");

class SequelizeDeckRepository {
	async findByUserAndType(userId, type) {
		return await DeckModel.findAll({
			where: { userId, type },
			include: [{ model: CardModel, as: "card" }],
		});
	}

	async findByVillain(villainId) {
        return await DeckModel.findAll({
            where: { villainId },
            include: [{ model: CardModel, as: "card" }],
        });
    }

    async insertCard({ userId, cardId, type = "library" }) {
        return await DeckModel.create({
        userId,
        cardId,
        type,
        });
    }

	async shuffleMainDeck(userId) {
        const deck = await this.findByUserAndType(userId, "main");
        return this._shuffle(deck);
    }

    async drawRandomCards(userId, cardNumber) {
        const deck = await this.findByVillain(userId);
        const shuffled = this._shuffle([...deck]);
        return shuffled.slice(0, cardNumber);
    }

    _shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

module.exports = SequelizeDeckRepository;
