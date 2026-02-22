const { toClientState } = require("#core/domain/services/BattleViewMapper");
const BattleAction = require("#core/use-cases/battle/BattleAction");
const VillainTurn = require("#core/use-cases/battle/VillainTurn");

class EndTurnController {
  async handle(req, res) {
    try {
      const action = new BattleAction();
      action.nextTurn(req.user.id);

      const villainAI = new VillainTurn();
      const { success, drawnCount, state, logs, actions } = await villainAI.execute(req.user.id);

      res.json({
          success,
          drawnCount,
          state: toClientState(state),
          logs,
          actions
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = EndTurnController;
