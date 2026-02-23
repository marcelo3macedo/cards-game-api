/**
 * @param {any} user
 * @param {any} villain
 * @param {import('../../types/BattleType').Card[]} playerDeck
 * @param {import('../../types/BattleType').Card[]} villainDeck
 * @returns {import('../../types/BattleType').BattleState}
 */
const createInitialState = (user, villain, playerDeck, villainDeck) => {
    return {
        player: {
            id: user.id,
            name: user.name,
            hp: 8000,
            hand: [],
            field: [ null, null, null, null, null ],
            spells: [ null, null, null, null, null ],
            graveyard: [],
            deck: playerDeck,
            canSummon: true,
            deckCount: playerDeck.length
        },
        opponent: {
            id: villain.id,
            name: villain.name,
            hp: 8000,
            hand: [],
            field: [ null, null, null, null, null ],
            spells: [ null, null, null, null, null ],
            graveyard: [],
            deck: villainDeck,
            handCount: 0,
            deckCount: villainDeck.length
        },
        environment: { activeField: null },
        turn: 1,
        currentTurnOwner: "player",
    };
};

module.exports = { createInitialState };
