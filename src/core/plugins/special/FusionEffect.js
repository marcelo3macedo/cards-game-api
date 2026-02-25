module.exports = {
    id: "FUSION_BASE",

    prepare(context) {
        return {
            status: "WAITING_SELECTION",
            targetType: "SELF_FIELD_MULTIPLE", // Front deve permitir selecionar 2 cartas
            minTargets: 2,
            maxTargets: 2,
            message: "Selecione 2 monstros para fundir"
        };
    },

    execute(context, selection) {
        const { state, engine, targetIndexes } = selection; // targetIndexes = [0, 2]

        const card1 = state.field[targetIndexes[0]];
        const card2 = state.field[targetIndexes[1]];

        // Busca na "Tabela de Receitas" se essa combinação existe
        const fusionResultId = engine.getFusionResult(card1.id, card2.id);

        if (fusionResultId) {
            // Sucesso: Remove os materiais e adiciona o novo monstro
            // Ordenamos para remover do maior index para o menor (evita erro de re-indexação)
            targetIndexes.sort((a, b) => b - a).forEach(idx => state.field.splice(idx, 1));

            const fusedMonster = engine.createCardInstance(fusionResultId);
            state.field.push(fusedMonster);

            return { status: "SUCCESS", logs: [`Fusão realizada! Bem-vindo, ${fusedMonster.name}!`] };
        }

        // Falha: Regra de "retornar a última" (ou simplesmente falhar e manter as cartas)
        // Como você pediu: se não for possível, retorna a última (card2)
        state.field.splice(targetIndexes[0], 1); // Remove a primeira
        // A segunda permanece no campo, mas você pode disparar um log de erro

        return {
            status: "FAILED",
            logs: ["As cartas não são compatíveis. A primeira carta foi perdida!"],
            newState: state
        };
    }
};
