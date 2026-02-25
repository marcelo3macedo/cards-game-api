module.exports = {
    id: "NEGATE_EFFECT",
    trigger: "ON_MAGIC_ACTIVATION",

    execute(context) {
        return {
            status: "CANCEL_OPPONENT_EFFECT",
            logs: ["A carta mágica do oponente foi anulada!"]
        };
    }
};
