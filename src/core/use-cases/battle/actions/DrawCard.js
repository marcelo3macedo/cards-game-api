const BattleStorage = require("../../../../infrastructure/cache/BattleStorage");
const DrawRules = require("../../../services/rules/DrawRules");

/**
 * @typedef {import('../../../types/BattleType').BattleState} BattleState
 */
class DrawCard {
    /**
     * @param {string} userId
     * @param {'player' | 'opponent'} targetSelector
     * @param {number} count
     */
    execute(userId, targetSelector, count = 1) {
        const state = BattleStorage.get(userId);
        if (!state) throw new Error("Battle not found.");

        const { newValue, logs, actions } = DrawRules.applyQuantityModifiers(state, count, targetSelector);

        const actor = targetSelector === 'player' ? state.player : state.opponent;
        let drawnCount = 0;

        for (let i = 0; i < newValue; i++) {
            if (actor.deck.length === 0) break;
            actor.hand.push(actor.deck.pop());
            drawnCount++;
            actor.handCount = drawnCount;
        }

        BattleStorage.save(userId, state);
        return { success: true, drawnCount, state, logs, actions };
    }

    initialDraw(userId, targetSelector) {
        const initialCount = parseInt(process.env.INITIAL_HAND_SIZE || '5', 10);
        return this.execute(userId, targetSelector, initialCount);
    }
}

module.exports = DrawCard;
