module.exports = {
    id: "NEGATE_ATTACK",
    trigger: "ON_BEING_ATTACKED",

    execute(context) {
        const { state, opponentState, engine } = context;

        engine.cancelCurrentAction();

        return {
            status: "SUCCESS",
            logs: ["Armadilha ativada! O ataque foi negado."]
        };
    }
};
