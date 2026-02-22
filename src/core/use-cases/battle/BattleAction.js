const BattleStorage = require("../../../infrastructure/cache/BattleStorage");
const { prepareCombatant } = require("../../../utils/battleUtils");
const EffectRegistry = require("./EffectRegistry");

class BattleAction {
	/**
     * @param {string} userId
     * @returns {import("src/core/types/BattleType").BattleState}
     */
	getState(userId) {
		const state = BattleStorage.get(userId);

		if (!state) throw new Error("No active battle found for this user.");
		return state;
	}

	summon(userId, handIndex, position) {
		const state = this.getState(userId);
		const p = state.player;
		const canAttack = state.turn > 1;

		if (!p.hand[handIndex]) throw new Error("Card not found in hand.");

		const card = p.hand.splice(handIndex, 1)[0];
		p.field.push({ card, position, canAttack });

		state.player.canSummon = false;

		BattleStorage.save(userId, state);
        return this.formatStateForClient(state);
	}

	changePosition(userId, fieldIndex, position) {
		const state = this.getState(userId);
		const p = state.player;

		if (state.currentTurnOwner !== "player") throw new Error("Not your turn!");

		const monster = p.field[fieldIndex];
		if (!monster) throw new Error("Monster not found on field.");

		monster.position = position;

		BattleStorage.save(userId, state);
		return this.formatStateForClient(state);
	}

	attack(userId, attackerIdx, targetIdx = null) {
		const state = this.getState(userId);
		const { player, opponent, environment } = state;

		if (state.currentTurnOwner !== "player") throw new Error("Not your turn!");

		const attacker = prepareCombatant(player.field[attackerIdx], environment);
		if (!attacker || attacker.position !== "attack") {
			throw new Error("Invalid attacker or monster in defense mode.");
		}

		if (targetIdx === null || opponent.field.length === 0) {
			const damage = attacker.actualAtk;
			opponent.hp -= damage;

			this._checkWinCondition(state);
			BattleStorage.save(userId, state);
			return { message: `Direct attack! ${damage} damage.`, state };
		}

		const target = prepareCombatant(opponent.field[targetIdx], environment);
		let message = "";

		const wasFaceDown = target.position.includes("face-down");
		if (wasFaceDown) {
			target.position = target.position.replace("face-down-", "");
			message = `Revealed! The hidden monster was ${target.card.name}. `;
		}

		if (target.position === "attack") {
			const diff = attacker.actualAtk - target.actualAtk;
			if (diff > 0) {
				opponent.graveyard.push(opponent.field.splice(targetIdx, 1)[0].card);
				opponent.hp -= diff;
				message = `Target destroyed! Opponent took ${diff} damage.`;
				state.player.field[attackerIdx].canAttack = false;
			} else if (diff < 0) {
				player.graveyard.push(player.field.splice(attackerIdx, 1)[0].card);
				player.hp -= Math.abs(diff);
				message = `Your monster was weaker! You took ${Math.abs(diff)} damage.`;
			} else {
				player.graveyard.push(player.field.splice(attackerIdx, 1)[0].card);
				opponent.graveyard.push(opponent.field.splice(targetIdx, 1)[0].card);
				message = "Both monsters destroyed!";
			}
		} else {
			const diff = attacker.actualAtk - target.actualDef;
			if (diff > 0) {
				opponent.graveyard.push(opponent.field.splice(targetIdx, 1)[0].card);
				message = "Defense breached! Monster destroyed.";
			} else {
				message = "Attack failed! Defense is too strong.";
			}
		}

		this._checkWinCondition(state);
		BattleStorage.save(userId, state);
        const baseState = this.formatStateForClient(state);

		return { message, state: baseState };
	}

	nextTurn(userId) {
		const state = this.getState(userId);

		state.currentTurnOwner =
			state.currentTurnOwner === "player" ? "opponent" : "player";

		if (state.currentTurnOwner === "player") {
			state.turn += 1;
			state.player.field.forEach((m) => (m.canAttack = true));
		}

		BattleStorage.save(userId, state);
        return this.formatStateForClient(state);
	}

	_checkWinCondition(state) {
		if (state.opponent.hp <= 0) {
			state.status = "victory";
			state.opponent.hp = 0;
		} else if (state.player.hp <= 0) {
			state.status = "lose";
			state.player.hp = 0;
		}
	}

	finish(userId) {
		const state = this.getState(userId);
		BattleStorage.delete(userId);
		return state;
	}

	formatStateForClient(state) {
        return {
            ...state,
            player: {
                ...state.player,
                deckCount: state.player.deck.length,
                deck: undefined,
            },
            opponent: {
                ...state.opponent,
                handCount: state.opponent.hand.length,
                deckCount: state.opponent.deck.length,
                deck: undefined,
                hand: undefined,
            }
        };
    }

	async prepareEffect(playerId, cardIndex, origin, executor) {
        const state = await this.getState(playerId);
		const exec = executor === "player" ? state.player : state.opponent;
        const card = origin === "hand"
			? exec.hand[cardIndex]
			: exec.spells[cardIndex].card;

	    const effectPlugin = EffectRegistry.getEffect(card.effectScript);

        if (!effectPlugin) {
            return { status: "SUCCESS", action: "SIMPLE_SUMMON" };
        }

        const result = effectPlugin.prepare({ state, card });

		if (result.removeCard) {
			const targetArray = origin === "hand" ? exec.hand : exec.spells;

			if (cardIndex !== -1 && targetArray[cardIndex]) {
				targetArray.splice(cardIndex, 1);
			}
		}

        if (result.status !== "WAITING_SELECTION") {
			BattleStorage.save(playerId, result.state);
			return result.state;
		}

		state.pendingAction = {
			cardHandIndex: cardIndex,
			effectId: card.id,
			targetType: result.targetType
		};
		BattleStorage.save(playerId, state);

        return { success: true, state, logs: result.logs, actions: result.actions };
    }
}

module.exports = BattleAction;
