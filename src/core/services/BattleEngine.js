class BattleEngine {
	// 1. Pegar nova carta (Draw)
	drawCard(side) {
		if (side.deck.length === 0) throw new Error("Deck Empty!");
		const card = side.deck.pop();
		side.hand.push(card);
		return card;
	}

	// 2. Colocar em campo
	summonMonster(side, handIndex, position = "attack") {
		const card = side.hand.splice(handIndex, 1)[0];
		side.field.push({ card, position, canAttack: false });
	}

	// 3. Atacar uma carta ou Pontos de Vida
	attack(
		attackerSide,
		defenderSide,
		attackerFieldIndex,
		defenderFieldIndex = null,
	) {
		const attacker = attackerSide.field[attackerFieldIndex];

		// Ataque Direto (se campo inimigo vazio)
		if (defenderFieldIndex === null) {
			defenderSide.hp -= attacker.card.attackPower;
			return { type: "DIRECT_ATTACK", damage: attacker.card.attackPower };
		}

		const defender = defenderSide.field[defenderFieldIndex];
		let damage = 0;

		if (defender.position === "attack") {
			damage = attacker.card.attackPower - defender.card.attackPower;
			if (damage > 0) {
				// Atacante vence
				this.sendToGraveyard(defenderSide, defenderFieldIndex);
				defenderSide.hp -= damage;
			} else if (damage < 0) {
				// Defensor vence
				this.sendToGraveyard(attackerSide, attackerFieldIndex);
				attackerSide.hp -= Math.abs(damage);
			}
		} else {
			// Modo Defesa: Não tira HP, apenas destrói se o ataque for maior
			damage = attacker.card.attackPower - defender.card.defensePower;
			if (damage > 0) this.sendToGraveyard(defenderSide, defenderFieldIndex);
		}

		return { damage };
	}

	sendToGraveyard(side, fieldIndex) {
		const removed = side.field.splice(fieldIndex, 1)[0];
		side.graveyard.push(removed.card);
	}
}
