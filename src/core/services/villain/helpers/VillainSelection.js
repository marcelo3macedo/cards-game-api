class VillainSelection {
	getBestMonsterIndex(hand) {
        if (!hand || hand.length === 0) return null;

        const monsters = hand
            .map((card, originalIdx) => ({ card, originalIdx }))
            .filter(item => item.card.attribute === 'monster');

        if (monsters.length === 0) return null;
        if (monsters.length === 1) return 0;

        const best = monsters.reduce((bestItem, currentItem) => {
            const currentMax = Math.max(
                currentItem.card.attackPower || 0,
                currentItem.card.defensePower || 0
            );

            const bestMax = Math.max(
                bestItem.card.attackPower || 0,
                bestItem.card.defensePower || 0
            );

            return currentMax > bestMax ? currentItem : bestItem;
        });

        return best.originalIdx;
    }

    getBestMonsterPosition(state, monster) {
        const playerField = (state.player.field || []).filter(item => item !== null);

        const canDestroySomething = playerField.length === 0 || playerField.some(fieldItem => {
            const targetCard = fieldItem.card;
            if (fieldItem.position === 'attack') {
                return monster.attackPower > targetCard.attackPower;
            }
            return monster.attackPower > targetCard.defensePower;
        });

        if (canDestroySomething) {
            return "attack";
        }

        const highDefense = playerField.length > 0 && playerField.every(fieldItem => {
            return monster.defensePower > fieldItem.card.attackPower;
        });

        if (highDefense) {
            return "defense";
        }

        const hasLowDefense = playerField.some(fieldItem => monster.defensePower <= fieldItem.card.attackPower);

        if (hasLowDefense && monster.attackPower > monster.defensePower) {
            return "face-down-attack";
        }

        return "face-down-defense";
    }

    getBestTarget(attacker, playerField) {
		let bestTargetIdx = -1;
		let maxBenefit = -1;
		const hiddenTargets = [];

		playerField.forEach((target, idx) => {
            if (!target) return;

			const isFaceDown = target.position.includes("face-down");

			if (!isFaceDown) {
				const targetVal = target.position === "attack"
					? target.card.attackPower
					: target.card.defensePower;

				if (attacker.card.attackPower >= targetVal) {
					const benefit = (attacker.card.attackPower - targetVal) + (targetVal * 0.5);
					if (benefit > maxBenefit) {
						maxBenefit = benefit;
						bestTargetIdx = idx;
					}
				}
			} else {
				hiddenTargets.push(idx);
			}
		});

		if (bestTargetIdx === -1 && hiddenTargets.length > 0) {
			const riskAppetite = attacker.card.attackPower / 2500;
			const shouldRisk = Math.random() < riskAppetite;

			if (shouldRisk) {
				const randomIdx = Math.floor(Math.random() * hiddenTargets.length);
				return hiddenTargets[randomIdx];
			}
		}

		return bestTargetIdx;
	}

    getBestFieldIndex(field) {
        const emptySlotIndex = field.findIndex(slot => slot === null);
        if (emptySlotIndex !== -1) {
            return emptySlotIndex;
        }

        let lowestAttack = Infinity;
        let bestIndex = 0;

        field.forEach((slot, index) => {
            if (slot && slot.card && slot.card.attackPower < lowestAttack) {
                lowestAttack = slot.card.attackPower;
                bestIndex = index;
            }
        });

        return bestIndex;
    }
}

module.exports = new VillainSelection();
