const BattleAction = require("#core/use-cases/battle/BattleAction");
const VillainTurn = require("#core/use-cases/battle/VillainTurn");

class EndTurnController {
  async handle(req, res) {
    try {
      const action = new BattleAction();
      action.nextTurn(req.user.id);

      const villainAI = new VillainTurn();
      const result = await villainAI.execute(req.user.id);

      res.json({
          message: "Turno do jogador finalizado. Vilão jogou.",
          logs: result.logs,
          actions: result.actions,
          state: result.state,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = EndTurnController;
