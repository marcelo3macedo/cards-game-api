const BattleStorage = require("../../../infrastructure/cache/BattleStorage");

class StartMockBattle {
    execute(userId, battleState) {
        if (!userId || !battleState) {
            throw new Error("userId and battleState are required");
        }

        BattleStorage.save(userId, battleState);

        return battleState;
    }
}

module.exports = StartMockBattle;
