module.exports = {
    id: "ATTRIBUTE_BUFF",
    type: "field",

    prepare(context) {
        const { state, card } = context;

        const buffValue = card.value || 200;
        const targetAttr = card.targetAttribute;

        state.fieldEffects.push({
            sourceId: card.id,
            type: "ATK_BUFF",
            attribute: targetAttr,
            value: buffValue
        });

        return {
            status: "SUCCESS",
            logs: [`O campo ${card.name} está ativo! Monstros do tipo ${targetAttr} ganham +${buffValue} ATK.`]
        };
    }
};
