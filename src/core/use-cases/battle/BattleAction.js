const BattleStorage = require("../../../infrastructure/cache/BattleStorage");
const EffectRegistry = require("./EffectRegistry");

class BattleAction {
	getState(userId) {
		const state = BattleStorage.get(userId);
		if (!state) throw new Error("No active battle found for this user.");
		return state;
	}

	draw(userId, count = 1) {
        const state = BattleStorage.get(userId);
        if (!state) throw new Error("Battle not found.");

        const p = state.player;

        for (let i = 0; i < count; i++) {
            if (p.deck.length === 0) break;

            const card = p.deck.pop();
            p.hand.push(card);
        }

        BattleStorage.save(userId, state);

        return this.formatStateForClient(state);
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
		const { player, opponent } = state;

		if (state.currentTurnOwner !== "player") throw new Error("Not your turn!");

		const attacker = player.field[attackerIdx];
		if (!attacker || attacker.position !== "attack") {
			throw new Error("Invalid attacker or monster in defense mode.");
		}

		// ATAQUE DIRETO (Se o oponente não tem monstros)
		if (targetIdx === null || opponent.field.length === 0) {
			const damage = attacker.card.attackPower;
			opponent.hp -= damage;

			this._checkWinCondition(state);
			BattleStorage.save(userId, state);
			return { message: `Direct attack! ${damage} damage.`, state };
		}

		// ATAQUE A MONSTRO
		const target = opponent.field[targetIdx];
		let message = "";

		// --- LÓGICA DE REVELAÇÃO (FLIP) ---
		const wasFaceDown = target.position.includes("face-down");
		if (wasFaceDown) {
			// Converte: face-down-attack -> attack | face-down-defense -> defense
			target.position = target.position.replace("face-down-", "");
			message = `Revealed! The hidden monster was ${target.card.name}. `;
		}

		if (target.position === "attack") {
			const diff = attacker.card.attackPower - target.card.attackPower;
			if (diff > 0) {
				// Atacante vence
				opponent.graveyard.push(opponent.field.splice(targetIdx, 1)[0].card);
				opponent.hp -= diff;
				message = `Target destroyed! Opponent took ${diff} damage.`;
				state.player.field[attackerIdx].canAttack = false;
			} else if (diff < 0) {
				// Defensor vence (Atacante se dá mal)
				player.graveyard.push(player.field.splice(attackerIdx, 1)[0].card);
				player.hp -= Math.abs(diff);
				message = `Your monster was weaker! You took ${Math.abs(diff)} damage.`;
			} else {
				// Empate (Ambos destruídos)
				player.graveyard.push(player.field.splice(attackerIdx, 1)[0].card);
				opponent.graveyard.push(opponent.field.splice(targetIdx, 1)[0].card);
				message = "Both monsters destroyed!";
			}
		} else {
			// Alvo em DEFESA
			const diff = attacker.card.attackPower - target.card.defensePower;
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

	// 2. TROCAR TURNO
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

	// 3. VERIFICAR VITÓRIA
	_checkWinCondition(state) {
		if (state.opponent.hp <= 0) {
			state.status = "victory";
			state.opponent.hp = 0;
		} else if (state.player.hp <= 0) {
			state.status = "lose";
			state.player.hp = 0;
		}
	}

	// 4. ENCERRAR E LIMPAR MEMÓRIA
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
			: exec.spells[cardIndex];

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

        return state;
    }
}

module.exports = BattleAction;
