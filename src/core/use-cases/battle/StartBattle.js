const BattleStorage = require("../../../infrastructure/cache/BattleStorage");

class StartBattle {
	constructor(userRepo, villainRepo, deckRepo) {
		this.userRepo = userRepo;
		this.villainRepo = villainRepo;
		this.deckRepo = deckRepo;
	}

	async execute(user, villainId) {
		const villain = await this.villainRepo.findById(villainId);

		const playerDeckRaw = await this.deckRepo.findByUserAndType(user.id, "main");
        const villainDeckRaw = await this.deckRepo.findByVillain(villainId);

		if (!user || !villain || playerDeckRaw.length < 5 || villainDeckRaw.length < 5) {
            throw new Error("Missing data to start battle (User, Villain or valid Decks).");
        }

		const shuffledPlayerDeck = playerDeckRaw
            .sort(() => Math.random() - 0.5)
            .map((d) => d.card);

        const shuffledVillainDeck = villainDeckRaw
            .sort(() => Math.random() - 0.5)
            .map((d) => d.card);

		const battleState = {
            player: {
                id: user.id,
                name: user.name,
                hp: 8000,
                hand: [],
                field: [],
                graveyard: [],
                deck: shuffledPlayerDeck,
				canSummon: true
            },
            opponent: {
                id: villain.id,
                name: villain.name,
                hp: 8000,
                hand: [],
                field: [],
                graveyard: [],
                deck: shuffledVillainDeck,
            },
            turn: 1,
            currentTurnOwner: "player",
        };

        BattleStorage.save(user.id, battleState);

		const clientBattleState = {
			player: {
				id: battleState.player.id,
				name: battleState.player.name,
				hp: battleState.player.hp,
				hand: [],
				deckCount: battleState.player.deck.length,
				field: [],
				graveyard: [],
				canSummon: battleState.player.canSummon
			},
			opponent: {
				id: battleState.opponent.id,
				name: battleState.opponent.name,
				hp: battleState.opponent.hp,
				handCount: 0,
				deckCount: battleState.opponent.deck.length,
				field: [],
				graveyard: []
			},
			turn: battleState.turn,
			currentTurnOwner: battleState.currentTurnOwner,
		};

        return clientBattleState;
	}
}

module.exports = StartBattle;
