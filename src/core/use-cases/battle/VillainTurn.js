const BattleStorage = require("../../../infrastructure/cache/BattleStorage");
const { prepareCombatant } = require("../../../utils/battleUtils");

class VillainTurn {
	async execute(userId) {
		const state = BattleStorage.get(userId);
		if (!state || state.currentTurnOwner !== "opponent") {
			throw new Error("Não é o turno do vilão ou batalha não encontrada.");
		}

		const { opponent, player, environment } = state;
		const logs = [];
		const actions = [];

		if (state.turn === 1) {
			for (let i = 0; i < 5; i++) {
				if (opponent.deck.length > 0) opponent.hand.push(opponent.deck.pop());
			}
			logs.push(`${opponent.name} comprou a mão inicial.`);
		} else if (opponent.deck.length > 0) {
			opponent.hand.push(opponent.deck.pop());
			logs.push(`${opponent.name} comprou uma carta.`);
		}

		if (opponent.hand.length > 0 && opponent.field.length < 5) {
			const monsterIndex = this._getBestMonsterIndex(opponent.hand);
			if (monsterIndex !== -1) {
				const monster = opponent.hand.splice(monsterIndex, 1)[0];

				const shouldSetHidden = opponent.hp < 1000 || monster.attackPower < 1000;
				const position = shouldSetHidden ? "face-down-defense" : "attack";

				opponent.field.push({
					card: monster,
					position: position,
					canAttack: position === "attack",
				});

				const logMsg = position.includes("face-down")
					? `${opponent.name} colocou uma carta virada para baixo.`
					: `${opponent.name} invocou ${monster.name} em modo de ataque.`;

				logs.push(logMsg);
				actions.push({ type: 'summon', data: { monster: position.includes("face-down") ? null : monster, position } });
			}
		}

		for (let i = 0; i < opponent.field.length; i++) {
			const attacker = prepareCombatant(opponent.field[i], environment);
			if (!attacker.canAttack || attacker.position !== "attack") continue;

			if (player.field.length === 0) {
				player.hp -= attacker.actualAtk;
				logs.push(`${attacker.card.name} atacou diretamente! Dano: ${attacker.actualAtk}`);
				actions.push({ type: 'attack', data: { attacker: attacker.card, target: null } });
			} else {
				const targetIdx = this._getBestTarget(attacker, player.field);
				if (targetIdx !== -1) {
					const target = prepareCombatant(player.field[targetIdx], environment);
					const isFaceDown = target.position.includes("face-down");

					if (isFaceDown) {
						target.position = target.position === "face-down-attack" ? "attack" : "defense";
						logs.push(`A carta virada para baixo era ${target.card.name}!`);
					}

					if (target.position === "attack") {
						const diff = attacker.actualAtk - target.actualAtk;
						if (diff > 0) {
							player.graveyard.push(player.field.splice(targetIdx, 1)[0].card);
							player.hp -= diff;
							logs.push(`${attacker.card.name} destruiu ${target.card.name}. Jogador perdeu ${diff} HP.`);
						} else if (diff < 0) {
							opponent.hp -= Math.abs(diff);
							logs.push(`${attacker.card.name} falhou. ${opponent.name} perdeu ${Math.abs(diff)} HP.`);
						} else {
							player.graveyard.push(player.field.splice(targetIdx, 1)[0].card);
							opponent.graveyard.push(opponent.field.splice(i, 1)[0].card);
							logs.push(`Ataque simultâneo! Ambos destruídos.`);
						}
					} else {
						const diff = attacker.actualAtk - target.actualDef;
						if (diff > 0) {
							player.graveyard.push(player.field.splice(targetIdx, 1)[0].card);
							logs.push(`${attacker.card.name} destruiu a defesa de ${target.card.name}.`);
						} else if (diff < 0) {
							opponent.hp -= Math.abs(diff);
							logs.push(`${target.card.name} resistiu. ${opponent.name} perdeu ${Math.abs(diff)} HP.`);
						}
					}

					actions.push({ type: 'attack', data: { attacker: attacker.card, target: target.card } });
				}
			}
		}

		if (player.hp <= 0) state.status = "lose";
		if (opponent.hp <= 0) state.status = "win";

		state.player.field.forEach(c => c.canAttack = true);
		state.currentTurnOwner = "player";
		state.turn += 1;
		state.player.canSummon = true;

		BattleStorage.save(userId, state);
		return { state: this.formatStateForClient(state), logs, actions };
	}

	_getBestMonsterIndex(hand) {
		return hand.reduce((bestIdx, card, idx, arr) => {
			if (!arr[bestIdx] || card.attackPower > arr[bestIdx].attackPower)
				return idx;
			return bestIdx;
		}, 0);
	}

	_getBestTarget(attacker, playerField) {
		let bestTargetIdx = -1;
		let maxBenefit = -1;
		const hiddenTargets = [];

		playerField.forEach((target, idx) => {
			const isFaceDown = target.position.includes("face-down");

			if (!isFaceDown) {
				// Lógica para cartas abertas (Certeza)
				const targetVal = target.position === "attack"
					? target.card.attackPower
					: target.card.defensePower;

				if (attacker.card.attackPower >= targetVal) {
					// Cálculo de benefício: prioriza destruir cartas com mais ataque/defesa
					// ou que causem mais dano ao HP do jogador.
					const benefit = (attacker.card.attackPower - targetVal) + (targetVal * 0.5);
					if (benefit > maxBenefit) {
						maxBenefit = benefit;
						bestTargetIdx = idx;
					}
				}
			} else {
				// Armazena alvos ocultos para considerar depois
				hiddenTargets.push(idx);
			}
		});

		// Se não encontrou nenhum alvo seguro para destruir...
		if (bestTargetIdx === -1 && hiddenTargets.length > 0) {
			// A IA decide arriscar se o atacante dela for "respeitável"
			// Ex: Se o ataque for > 1500, ela tem 70% de chance de atacar no escuro.
			const riskAppetite = attacker.card.attackPower / 2500; // Normaliza baseado num teto de poder
			const shouldRisk = Math.random() < riskAppetite;

			if (shouldRisk) {
				// Escolhe um alvo oculto aleatoriamente
				const randomIdx = Math.floor(Math.random() * hiddenTargets.length);
				return hiddenTargets[randomIdx];
			}
		}

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
