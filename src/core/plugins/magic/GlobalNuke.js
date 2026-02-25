module.exports = {
    id: "DARK_HOLE_TYPE",
    prepare(context) {
        const { state } = context;

        state.player.graveyard.push(...state.player.field, ...state.player.spells);
        state.opponent.graveyard.push(...state.opponent.field, ...state.opponent.spells);

        state.player.field = [ null, null, null, null, null ];
        state.opponent.field = [ null, null, null, null, null ];
        state.player.spells = [ null, null, null, null, null ];
        state.opponent.spells = [ null, null, null, null, null ];

        return {
            status: "SUCCESS",
            logs: ["O campo inteiro foi destruído e as cartas foram para o cemitério!"],
            state,
            removeCard: true
        };
    }
};
