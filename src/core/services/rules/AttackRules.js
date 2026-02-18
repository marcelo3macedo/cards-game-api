const EffectRegistry = require('#core/use-cases/battle/EffectRegistry');

class AttackRules {
    /**
     * @param {import('../../types/BattleType').BattleState} state
     * @param {'player' | 'opponent'} actor
     * @returns {{ allowed: boolean, logs: string[], actions: any[], state: any }}
     */
    applyModifiers(state, actor) {
        let collectedLogs = [];
        let actions = [];
        let allowed = true;
        const enemy = actor === 'player' ? state.opponent : state.player;

        for (let i = 0; i < enemy.spells.length; i++) {
            const slot = enemy.spells[i];
            if (!slot || !slot.card) continue;

            const effect = EffectRegistry.getEffect(slot.card.effectScript);
            if (!effect || effect.trigger !== "ON_ATTACK") continue;

            const result = effect.execute({
                state,
                card: slot.card,
                actor
            });
            allowed = result.allowed;

            if (result && result.status === "SUCCESS") {
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
            allowed,
            logs: collectedLogs,
            actions,
            state
        }
    }
}

module.exports = new AttackRules();
