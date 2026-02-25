module.exports = {
    id: "DRAW_NEGATION",
    trigger: "ON_DRAW",

    execute(context) {
        const { card } = context;

        return {
            status: "SUCCESS",
            newValue: 0,
            logs: [`${card.name} foi ativada! O efeito de "${card.name}" negou a compra de cartas.`]
        };
    }
};
