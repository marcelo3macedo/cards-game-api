module.exports = {
    id: "OPPONENT_FIELD_CLEAN",
    prepare(context) {
        const { state } = context;

        state.opponent.graveyard.push(...state.opponent.field, ...state.opponent.spells);

        state.opponent.field = [ null, null, null, null, null ];
        state.opponent.spells = [ null, null, null, null, null ];

        return {
            status: "SUCCESS",
            logs: ["O campo inteiro do oponente foi destruído e as cartas foram para o cemitério!"],
            state,
            removeCard: true
        };
    }
};
