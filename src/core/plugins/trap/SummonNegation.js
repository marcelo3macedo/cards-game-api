module.exports = {
    id: "SUMMON_NEGATION",
    trigger: "ON_SUMMON",

    execute(context) {
        const { state, card, actor } = context;
        const caller = actor === 'player' ? state.player : state.opponent;
        caller.canSummon = false;

        return {
            status: "SUCCESS",
            allowed: false,
            logs: [`${card.name} foi ativada! O efeito de "${card.name}" negou a compra de cartas.`]
        };
    }
};
