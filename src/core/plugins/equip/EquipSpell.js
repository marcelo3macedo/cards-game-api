module.exports = {
    id: "EQUIP_SPELL",
    type: "equip",

    prepare({ state, card }) {
        const { location = "field", allowedElements = [] } = card.effectValue || {};

        const hasMonster = state.player.field.some(m => m !== null);
        if (!hasMonster) {
            throw new Error("Nenhum monstro no campo para equipar.");
        }

        const elementHint = allowedElements.length > 0
            ? ` (elemento: ${allowedElements.join(", ")})`
            : "";

        return {
            status: "WAITING_SELECTION",
            targetType: location,
            allowedElements,
            message: `Escolha um monstro${elementHint} para equipar.`,
        };
    },

    execute({ state, card, cardIndex, origin }, { fieldIndex }) {
        const { allowedElements = [], atk = 0, def = 0 } = card.effectValue || {};

        const target = state.player.field[fieldIndex];
        if (!target) throw new Error("Monstro alvo não encontrado.");

        if (
            allowedElements.length > 0 &&
            !allowedElements.includes(target.card.element)
        ) {
            throw new Error(
                `Este equipamento só pode ser usado em monstros do elemento: ${allowedElements.join(", ")}.`
            );
        }

        if (!target.card.modifiers) target.card.modifiers = [];
        target.card.modifiers.push({ source: card.id, sourceName: card.name, atk, def });

        if (origin === "hand") {
            state.player.hand.splice(cardIndex, 1);
        }
        state.player.spells.push({ card });

        return {
            status: "SUCCESS",
            logs: [`${card.name} equipado em ${target.card.name}! (+${atk} ATK / +${def} DEF)`],
            state,
        };
    },
};
