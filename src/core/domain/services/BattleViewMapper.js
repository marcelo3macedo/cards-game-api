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
            hp: battleState.player.hp < 0 ? 0 : battleState.player.hp,
            deckCount: battleState.player.deck?.length || 0
        },
        opponent: {
            ...opponentData,
            hp: battleState.opponent.hp < 0 ? 0 : battleState.opponent.hp,
            handCount: battleState.opponent.handCount || battleState.opponent.hand?.length || 0,
            deckCount: battleState.opponent.deck?.length || 0
        },
        environment: battleState.environment,
        turn: battleState.turn,
        currentTurnOwner: battleState.currentTurnOwner,
    };
};

module.exports = { toClientState };
