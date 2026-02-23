const AttackRules = require("#core/services/rules/AttackRules");
const BattleStorage = require("#infrastructure/cache/BattleStorage");
const { prepareCombatant } = require("#utils/battleUtils");

class HandleAttack {
    execute(userId, targetSelector, attackerIdx, targetIdx) {
        const state = BattleStorage.get(userId);
		const { environment } = state;

		if (state.currentTurnOwner !== targetSelector) throw new Error("Not your turn!");

        const actor = targetSelector === 'player' ? state.player : state.opponent;
        const enemy = targetSelector === 'player' ? state.opponent : state.player;

		const attacker = prepareCombatant(actor.field[attackerIdx], environment);
        if (!attacker || attacker.position !== "attack") {
			throw new Error("Invalid attacker or monster in defense mode.");
		}

        actor.field[attackerIdx].canAttack = false;
        const { allowed, state: newState, logs, actions } = AttackRules.applyModifiers(state, targetSelector);
        if (!allowed) {
            BattleStorage.save(userId, newState);
            return { success: true, state: newState, logs, actions };
        }

		if (targetIdx === null || enemy.field.length === 0) {
            const { logs, actions } = this._handleDirectAttack(attacker, enemy);
            return { success: true, state, logs, actions };
        }

        const target = prepareCombatant(enemy.field[targetIdx], environment);
        const result = this._handleMonsterBattle(actor, enemy, attacker, target, attackerIdx, targetIdx);

        return { success: true, state, logs: result.logs, actions: result.actions };
    }

    _handleDirectAttack(attacker, enemy) {
        const damage = attacker.actualAtk;
        enemy.hp -= damage;

        return {
            logs: [
                `Ataque direto! ${damage} de danos.`
            ],
            actions: [
                {
                    type: 'attack',
                    data: {
                        attacker: attacker.card,
                        target: null
                    }
                }
            ]
        };
    }

    _handleMonsterBattle(actor, enemy, attacker, target, attackerIdx, targetIdx) {
        let logs = [];
        let actions = [];

        if (target.position.includes("face-down")) {
            target.position = target.position.replace("face-down-", "");
            logs.push(`Revealed! The hidden monster was ${target.card.name}. `);
            actions.push({
                type: 'reveal',
                target,
                targetIdx
            })
        }

        actions.push({
            type: 'attack',
            data: {
                attacker: attacker.card,
                target: target.card,
                position: target.position
            }
        });

        if (target.position === "attack") {
            return this._calculateAtkVsAtk(actor, enemy, attacker, target, logs, actions, attackerIdx, targetIdx);
        } else {
            return this._calculateAtkVsDef(actor, enemy, attacker, target, logs, actions, targetIdx);
        }
    }

    _calculateAtkVsAtk(actor, enemy, attacker, target, logs, actions, attackerIdx, targetIdx) {
        const diff = attacker.actualAtk - target.actualAtk;
        if (diff > 0) {
            const destroyed = enemy.field[targetIdx];
            enemy.graveyard.push(destroyed.card);
            enemy.field[targetIdx] = null;
            enemy.hp -= diff;
            logs.push(`Target destroyed! Opponent took ${diff} damage.`)

            return {
                logs,
                actions
            };
        }

        if (diff < 0) {
            const destroyed = actor.field[attackerIdx];
            actor.graveyard.push(destroyed.card);

            actor.field[attackerIdx] = null;
            actor.hp -= Math.abs(diff);
            logs.push(`Your monster was weaker! You took ${Math.abs(diff)} damage.`)

            return {
                logs,
                actions
            };
        }

        const destroyedActor = actor.field[attackerIdx];
        const destroyedEnemy = enemy.field[targetIdx];

        actor.graveyard.push(destroyedActor.card);
        enemy.graveyard.push(destroyedEnemy.card);

        actor.field[attackerIdx] = null;
        enemy.field[targetIdx] = null;

        logs.push(`Both monsters destroyed!`);

        return {
            logs,
            actions
        };
    }

    _calculateAtkVsDef(actor, enemy, attacker, target, logs, actions, targetIdx) {
        const diff = attacker.actualAtk - target.actualDef;
        if (diff > 0) {
            const destroyed = enemy.field[targetIdx];
            enemy.graveyard.push(destroyed.card);
            enemy.field[targetIdx] = null;

            logs.push(`Defense breached! Monster destroyed.`)

            return {
                logs,
                actions
            };
        }

        actor.hp -= Math.abs(diff);
        logs.push(`Attack failed! Defense is too strong.`);

        return {
            logs,
            actions
        };
    }
}

module.exports = HandleAttack;
