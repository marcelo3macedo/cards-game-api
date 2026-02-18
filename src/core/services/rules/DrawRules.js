const EffectRegistry = require('../../use-cases/battle/EffectRegistry');

class DrawRules {
    /**
     * @param {import('../../types/BattleType').BattleState} state
     * @param {number} baseValue
     * @param {'player' | 'opponent'} actor
     * @returns {{ newValue: number, logs: string[], actions: any[] }}
     */
    applyQuantityModifiers(state, baseValue, actor) {
        let finalValue = baseValue;
        let collectedLogs = [];
        let actions = [];
        const enemy = actor === 'player' ? state.opponent : state.player;

        for (let i = 0; i < enemy.spells.length; i++) {
            const slot = enemy.spells[i];
            if (!slot || !slot.card) continue;

            const effect = EffectRegistry.getEffect(slot.card.effectScript);
            if (!effect || effect.trigger !== "ON_DRAW") continue;

            const result = effect.execute({
                state,
                baseValue: finalValue,
                card: slot.card,
                activationTurn: slot.activationTurn
            });

            if (result && result.status === "SUCCESS") {
                finalValue = result.newValue;
                collectedLogs = result.logs || [];

                const duration = effect.duration || 0;
                const turnActivated = slot.activationTurn || state.turn;

                actions.push({
                    type: 'trap_trigger',
                    card: slot
                })

                if (duration === 0 || state.turn > (turnActivated + duration)) {
                    enemy.spells.splice(i, 1);
                } else {
                    enemy.spells[i].isFaceDown = false;
                }

                break;
            }
        }

        return {
            newValue: Math.max(0, finalValue),
            logs: collectedLogs,
            actions
        };
    }
}

module.exports = new DrawRules();
