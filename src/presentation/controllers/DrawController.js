const { toClientState } = require("#core/domain/services/BattleViewMapper");
const DrawCard = require("#core/use-cases/battle/actions/DrawCard");

class DrawController {
  async handleDraw(req, res) {
    try {
      const useCase = new DrawCard();
      const { success, drawnCount, state, logs, actions } = await useCase.execute(req.user.id, "player");

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

module.exports = DrawController;
