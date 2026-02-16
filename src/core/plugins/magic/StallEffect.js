module.exports = {
    id: "STALL_TURNS",
    type: "magic",

    prepare(context) {
        const { state, card, opponentState } = context;
        const duration = card.value || 3;

        return {
            status: "SUCCESS",
            logs: [`${card.name} ativada! O oponente não pode atacar por ${duration} turnos.`]
        };
    }
};
