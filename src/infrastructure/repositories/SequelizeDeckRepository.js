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

	async shuffleMainDeck(userId) {
        const deck = await this.findByUserAndType(userId, "main");
        return this._shuffle(deck);
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
