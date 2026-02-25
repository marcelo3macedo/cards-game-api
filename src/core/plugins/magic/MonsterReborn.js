module.exports = {
    id: "MONSTER_REBORN",
    type: "magic",

    prepare(context) {
        const { playerState } = context;

        if (playerState.graveyard.length === 0) {
            throw new Error("Cemitério está vazio!");
        }

        return {
            status: "WAITING_SELECTION",
            targetType: "GRAVEYARD",
            message: "Escolha um monstro para reviver"
        };
    },

    execute(context, selection) {
        const { playerState, targetIndex } = selection;
        return { status: "SUCCESS", logs: ["Monstro revivido!"] };
    }
};
