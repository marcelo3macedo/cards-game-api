const BattleStorage = require("../../../infrastructure/cache/BattleStorage");
const { createInitialState } = require("../../domain/entities/BattleState");
const { toClientState } = require("../../domain/services/BattleViewMapper");

class StartBattle {
	constructor(userRepo, villainRepo, deckRepo) {
		this.userRepo = userRepo;
		this.villainRepo = villainRepo;
		this.deckRepo = deckRepo;
	}

	async execute(user, villainId) {
		const villain = await this.villainRepo.findById(villainId);
		const playerDeckRaw = await this.deckRepo.findByUserMain(user.id);
        const villainDeckRaw = await this.deckRepo.findByVillain(villainId);

		this._validate(user, villain, playerDeckRaw, villainDeckRaw);

		const playerDeck = this._shuffle(playerDeckRaw);
        const villainDeck = this._shuffle(villainDeckRaw);
		const battleState = createInitialState(user, villain, playerDeck, villainDeck);

        BattleStorage.save(user.id, battleState);

        return toClientState(battleState);
	}

	_validate(user, villain, pDeck, vDeck) {
        if (!user || !villain || pDeck.length < 5 || vDeck.length < 5) {
            throw new Error("Missing data to start battle (User, Villain or valid Decks).");
        }
    }

    _shuffle(deckRaw) {
        return deckRaw
            .sort(() => Math.random() - 0.5)
            .map((d) => d.card);
    }
}

module.exports = StartBattle;
