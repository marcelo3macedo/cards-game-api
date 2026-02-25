const prepareCombatant = (fieldSlot, environment) => {
    if (!fieldSlot || !fieldSlot.card) return null;

    const { card } = fieldSlot;

    let totalModAtk = (card.modifiers || []).reduce((acc, m) => acc + (m.atk || 0), 0);
    let totalModDef = (card.modifiers || []).reduce((acc, m) => acc + (m.def || 0), 0);

    if (environment?.activeField?.effects) {
        environment.activeField.effects.forEach(effect => {
            const isTarget =
                effect.target.type === card.element ||
                effect.target.type === card.type ||
                effect.target.type === card.attribute ||
                effect.target.type === 'all';

            if (isTarget) {
                totalModAtk += (effect.modifiers.atk || 0);
                totalModDef += (effect.modifiers.def || 0);
            }
        });
    }

    return {
        ...fieldSlot,
        actualAtk: Math.max(0, card.attackPower + totalModAtk),
        actualDef: Math.max(0, card.defensePower + totalModDef),
        name: card.name
    };
};

const formatStateForClient = (state) => {
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

module.exports = { prepareCombatant, formatStateForClient };
