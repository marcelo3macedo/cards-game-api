class BattleSession {
	constructor(user, villain, userDeck, villainDeck) {
		this.player = {
			info: user,
			hp: 8000,
			hand: [],
			field: [], // { card, position: 'attack' | 'defense' }
			graveyard: [],
			deck: userDeck, // Já embaralhado
		};
		this.boss = {
			info: villain,
			hp: 8000,
			hand: [],
			field: [],
			graveyard: [],
			deck: villainDeck,
		};
		this.turn = 1;
		this.phase = "draw"; // draw, standby, main, battle, end
	}
}
