const { toClientState } = require("#core/domain/services/BattleViewMapper");
const SummonMonster = require("../../core/use-cases/battle/actions/SummonMonster");

class SummonController {
  async handleSummon(req, res) {
    try {
      const { handIndex, position } = req.body;

      if (handIndex === undefined || !position) {
        return res.status(400).json({ error: "handIndex and position are required." });
      }

      const useCase = new SummonMonster();
      const { success, drawnCount, state, logs, actions } = await useCase.execute(req.user.id, "player", handIndex, position);

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

module.exports = SummonController;
