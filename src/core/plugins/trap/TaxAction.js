module.exports = {
    id: "ENERGY_DRAIN",
    trigger: "ON_OPPONENT_ACTION",

    execute(context) {
        const { opponentState, card } = context;
        const tax = card.value || 200;

        opponentState.hp -= tax;

        return {
            status: "SUCCESS",
            logs: [`Oponente pagou ${tax} de vida para ativar uma carta.`]
        };
    }
};
