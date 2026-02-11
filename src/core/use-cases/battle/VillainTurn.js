const BattleStorage = require("../../../infrastructure/cache/BattleStorage");

class VillainTurn {
	async execute(userId) {
		const state = BattleStorage.get(userId);
		if (!state || state.currentTurnOwner !== "opponent") {
			throw new Error("Não é o turno do vilão ou batalha não encontrada.");
		}

		const { opponent, player } = state;
		const logs = [];
		const actions = [];

		// 1. FASE DE COMPRA (DRAW)
		if (state.turn === 1) {
			for (let i = 0; i < 5; i++) {
				if (opponent.deck.length > 0) {
					const card = opponent.deck.pop();
					opponent.hand.push(card);
				}
			}
			logs.push(`${opponent.name} comprou a mão inicial (5 cartas).`);
		} else {
			// Lógica padrão de compra por turno
			if (opponent.deck.length > 0) {
				const card = opponent.deck.pop();
				opponent.hand.push(card);
				logs.push(`${opponent.name} comprou uma carta.`);
			}
		}

		// 2. FASE PRINCIPAL (INVOCAÇÃO)
		// Lógica simples: Se tem monstro na mão, invoca o de maior ataque
		if (opponent.hand.length > 0 && opponent.field.length < 5) {
			const monsterIndex = this._getBestMonsterIndex(opponent.hand);
			if (monsterIndex !== -1) {
				const monster = opponent.hand.splice(monsterIndex, 1)[0];
				opponent.field.push({
					card: monster,
					position: "attack",
					canAttack: true,
				});
				logs.push(
					`${opponent.name} invocou ${monster.name} em modo de ataque.`,
				);
				actions.push({
					type: 'summon',
					data: {
						monster
					}
				})
			}
		}

		// 3. FASE DE BATALHA (ATAQUE)
		for (let i = 0; i < opponent.field.length; i++) {
            const attacker = opponent.field[i];

            if (player.field.length === 0) {
                // Ataque Direto
                player.hp -= attacker.card.attackPower;
                logs.push(
                    `${attacker.card.name} atacou diretamente! Dano: ${attacker.card.attackPower}`,
                );
				actions.push({
					type: 'attack',
					data: {
						monster: null
					}
				});
            } else {
                const targetIdx = this._getBestTarget(attacker, player.field);
                if (targetIdx !== -1) {
                    const target = player.field[targetIdx];

                    if (target.position === "attack") {
                        const diff = attacker.card.attackPower - target.card.attackPower;

                        if (diff > 0) {
                            player.graveyard.push(player.field.splice(targetIdx, 1)[0].card);
                            player.hp -= diff;
                            logs.push(`${attacker.card.name} destruiu ${target.card.name}. Jogador perdeu ${diff} de HP.`);
                        } else if (diff < 0) {
                            const damageToVillain = Math.abs(diff);
                            opponent.hp -= damageToVillain;
                            logs.push(`${attacker.card.name} falhou ao atacar ${target.card.name}. ${opponent.name} perdeu ${damageToVillain} de HP.`);
                        } else {
                            player.graveyard.push(player.field.splice(targetIdx, 1)[0].card);
                            opponent.graveyard.push(opponent.field.splice(i, 1)[0].card);
                            logs.push(`Ataque simultâneo! Ambos os monstros foram destruídos.`);
                        }
                    } else {
                        const diff = attacker.card.attackPower - target.card.defensePower;
                        if (diff > 0) {
                            player.graveyard.push(player.field.splice(targetIdx, 1)[0].card);
                            logs.push(`${attacker.card.name} destruiu a defesa de ${target.card.name}.`);
                        } else if (diff < 0) {
                            const damageToVillain = Math.abs(diff);
                            opponent.hp -= damageToVillain;
                            logs.push(`${target.card.name} resistiu ao ataque. ${opponent.name} perdeu ${damageToVillain} de HP.`);
                        }
                    }

					actions.push({
						type: 'attack',
						data: {
							attacker: attacker.card,
							target: target.card
						}
					});
                }
            }
        }

        // 4. FINALIZAR TURNO E VERIFICAR VITÓRIA/DERROTA
        if (player.hp <= 0) {
            player.hp = 0;
            state.status = "lose";
        }

        if (opponent.hp <= 0) {
            opponent.hp = 0;
            state.status = "win";
        }

		// 4. FINALIZAR TURNO
		state.currentTurnOwner = "player";
		state.turn += 1;

		BattleStorage.save(userId, state);
		const baseState = this.formatStateForClient(state);

		return { state: baseState, logs, actions };
	}

	_getBestMonsterIndex(hand) {
		return hand.reduce((bestIdx, card, idx, arr) => {
			if (!arr[bestIdx] || card.attackPower > arr[bestIdx].attackPower)
				return idx;
			return bestIdx;
		}, 0);
	}

	_getBestTarget(attacker, playerField) {
		// Encontra o monstro que o vilão pode destruir com maior lucro
		let bestTargetIdx = -1;
		let maxDamage = -1;

		playerField.forEach((target, idx) => {
			const targetVal =
				target.position === "attack"
					? target.card.attackPower
					: target.card.defensePower;
			if (attacker.card.attackPower > targetVal) {
				const diff = attacker.card.attackPower - targetVal;
				if (diff > maxDamage) {
					maxDamage = diff;
					bestTargetIdx = idx;
				}
			}
		});
		return bestTargetIdx;
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
}

module.exports = VillainTurn;
