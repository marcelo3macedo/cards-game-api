const SummonRules = require('#core/services/rules/SummonRules');
const BattleStorage = require('#infrastructure/cache/BattleStorage');
const { prepareCombatant } = require('#utils/battleUtils');

/**
 * @typedef {import('../../../types/BattleType').BattleState} BattleState
 */
class SummonMonster {
    /**
     * @param {string} userId
     * @param {'player' | 'opponent'} targetSelector
     * @param {number} handIndex
     * @param {string} position
     */
    execute(userId, targetSelector, handIndex, position) {
        const state = BattleStorage.get(userId);
        const actor = targetSelector === 'player' ? state.player : state.opponent;
		const canAttack = state.turn > 1;

        if (!actor.hand[handIndex]) throw new Error("Card not found in hand.");

        const { allowed, state: newState, logs, actions } = SummonRules.applySummonModifiers(state, targetSelector);
        if (!allowed) {
            BattleStorage.save(userId, newState);
            return { success: true, state: newState, logs, actions };
        }

		const card = actor.hand.splice(handIndex, 1)[0];
        const fieldSlot = {
            card,
            position,
            canAttack,
            isNew: true
        };
        const preparedSlot = prepareCombatant(fieldSlot, newState.environment || state);

		actor.field.push(preparedSlot);
        actor.canSummon = false;

        BattleStorage.save(userId, newState);
        return { success: true, state: newState, logs, actions };
    }
}

module.exports = SummonMonster;
