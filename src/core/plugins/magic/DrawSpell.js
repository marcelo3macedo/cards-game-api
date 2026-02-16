module.exports = {
    id: "POT_OF_GREED_TYPE",
    prepare(context) {
        const { state, card } = context;
        const { value, target } = card.effectValue;

        const targetEntity = target === "player" ? state.player : state.opponent;
        const count = value || 1;
        const drawnCards = [];

        for (let i = 0; i < count; i++) {
            if (!targetEntity.deck || targetEntity.deck.length === 0) break;

            const pulledCard = targetEntity.deck.pop();
            targetEntity.hand.push(pulledCard);
            targetEntity.handCount = targetEntity.hand.length;
            drawnCards.push(pulledCard.name);
        }

        const log = target === "player"
            ? `Você comprou ${drawnCards.length} carta(s).`
            : `O oponente comprou ${drawnCards.length} carta(s).`;

        return {
            status: "SUCCESS",
            logs: [log],
            state,
            removeCard: true
        };
    }
};
