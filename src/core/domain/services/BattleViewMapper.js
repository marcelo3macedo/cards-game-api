/**
 * @typedef {import('../../types/BattleType').BattleState} BattleState
 * @typedef {import('../../types/BattleType').BattleStateClient} BattleStateClient
 */

/**
 * Mapeia o estado interno da batalha para um estado seguro para o cliente.
 * @param {BattleState} battleState
 * @returns {BattleStateClient}
 */
const toClientState = (battleState) => {
    const { deck: _pDeck, ...playerData } = battleState.player;
    const { deck: _oDeck, hand: _oHand, ...opponentData } = battleState.opponent;

    return {
        player: {
            ...playerData,
            deckCount: battleState.player.deck.length
        },
        opponent: {
            ...opponentData,
            handCount: battleState.opponent.hand.length,
            deckCount: battleState.opponent.deck.length
        },
        environment: battleState.environment,
        turn: battleState.turn,
        currentTurnOwner: battleState.currentTurnOwner,
    };
};

module.exports = { toClientState };
