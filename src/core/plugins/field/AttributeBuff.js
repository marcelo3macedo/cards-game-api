module.exports = {
    id: "ATTRIBUTE_BUFF",
    type: "field",

    prepare(context) {
        const { state, card } = context;

        const buffAtk = card.value?.atk || 200;
        const buffDef = card.value?.def || 0;
        const targetAttr = card.targetAttribute;

        state.environment.activeField = {
            id: card.id,
            name: card.name,
            type: card.type,
            effects: [
                {
                    target: {
                        type: targetAttr
                    },
                    modifiers: {
                        atk: buffAtk,
                        def: buffDef
                    }
                }
            ]
        };

        return {
            status: "SUCCESS",
            logs: [
                `O campo ${card.name} está ativo!`,
                `Efeito: [${targetAttr}] ganham +${buffAtk} ATK / +${buffDef} DEF.`
            ]
        };
    }
};
