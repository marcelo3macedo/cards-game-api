module.exports = {
    id: "MIRROR_FORCE_TYPE",
    trigger: "ON_BEING_ATTACKED",

    execute(context) {
        const { opponentState, attackerIndex } = context;

        opponentState.field.splice(attackerIndex, 1);

        return {
            status: "SUCCESS",
            logs: ["Armadilha! O monstro atacante foi destruído."]
        };
    }
};
