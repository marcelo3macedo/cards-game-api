module.exports = {
    id: "HEAL_SPELL",
    prepare(context) {
        const { state, card } = context;
        const healAmount = card.effectValue?.points || 500;
        const target = card.effectValue?.target || "player";

        if (target === "player") {
            state.player.hp += healAmount;
        } else {
            state.opponent.hp += healAmount;
        }

        const log = healAmount > 0
            ? `${healAmount} de HP recuperado.`
            : `${healAmount} de HP infligido.`

        return {
            status: "SUCCESS",
            logs: [ log ],
            state,
            removeCard: true
        };
    }
};
