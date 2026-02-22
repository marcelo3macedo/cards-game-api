const DrawCard = require("#core/use-cases/battle/actions/DrawCard");
const HandleAttack = require("#core/use-cases/battle/actions/HandleAttack");
const SummonMonster = require("#core/use-cases/battle/actions/SummonMonster");
const { prepareCombatant } = require("#utils/battleUtils");
const VillainSelection = require("./helpers/VillainSelection");

class VillainTurnEngine {
    async drawPhrase({ userId, state }) {
        const count = state.turn <= 2 ? 5 : 1;
        const useCase = new DrawCard();

        const { state: newState, actions } = await useCase.execute(userId, "opponent", count);

        actions.push({
            type: 'handCountUpdated', handCount: newState.opponent.handCount
        });

        return {
            state: newState,
            actions,
        }
    }

    async summonPhrase({ userId, state }) {
        const bestMonsterIndex = VillainSelection.getBestMonsterIndex(state.opponent.hand);
        if (bestMonsterIndex === null) {
            return {
                state,
                actions: []
            }
        }

        const position = VillainSelection.getBestMonsterPosition(state, state.opponent.hand[bestMonsterIndex]);
        const useCase = new SummonMonster();
        const { state: newState, actions } = await useCase.execute(userId, "opponent", bestMonsterIndex, position);

        actions.push({
            type: 'summon',
            data: {
                card: state.opponent.hand[bestMonsterIndex],
                position: position,
                canAttack: true,
                index: newState.opponent.field.length - 1
            },
            handCount: newState.opponent.handCount
        })

        return {
            state: newState,
            actions,
        }
    }

    async attackPhrase({ userId, state }) {
        const handleAttack = new HandleAttack();

        let currentState = state;
        const allActions = [];

        const { opponent, environment, player } = state;
        for (let i = 0; i < opponent.field.length; i++) {
			const attacker = prepareCombatant(opponent.field[i], environment);
			if (!attacker.canAttack || attacker.position !== "attack") continue;

            if (player.field.length === 0) {
                const directAttack = handleAttack.execute(userId, "opponent", i, null);

                currentState = directAttack.state;
                allActions.push(...directAttack.actions);
            } else {
				const targetIdx = VillainSelection.getBestTarget(attacker, player.field);
                if (targetIdx !== -1) {
                    const monsterAttack = handleAttack.execute(userId, "opponent", i, targetIdx);
                    currentState = monsterAttack.state;
                    allActions.push(...monsterAttack.actions);
                }
            }
        }

        return {
            state: currentState,
            actions: allActions,
        }
    }

    updatedTurn({ state }) {
        state.turn += 1;
        state.currentTurnOwner = "opponent";
        return state;
    }

    passTurnToPlayer({ state }) {
        state.player.field.forEach(c => c.canAttack = true);
        state.player.canSummon = true;
        state.currentTurnOwner = "player";

        return state;
    }
}

module.exports = new VillainTurnEngine();
