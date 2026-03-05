const { toClientState } = require("#core/domain/services/BattleViewMapper");
const CheckFusion = require("../../core/use-cases/battle/actions/CheckFusion");
const SummonFusion = require("../../core/use-cases/battle/actions/SummonFusion");

class FusionController {
  async checkFusion(req, res) {
    try {
      const { handIndices } = req.body;

      if (!Array.isArray(handIndices) || handIndices.length === 0) {
        return res.status(400).json({ error: "handIndices must be a non-empty array." });
      }

      const useCase = new CheckFusion();
      const result = await useCase.execute(req.user.id, handIndices);

      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async summonFusion(req, res) {
    try {
      const { handIndices, position, selectedFieldIndex } = req.body;

      if (!Array.isArray(handIndices) || handIndices.length === 0) {
        return res.status(400).json({ error: "handIndices must be a non-empty array." });
      }

      if (!position) {
        return res.status(400).json({ error: "position is required." });
      }

      const useCase = new SummonFusion();
      const { success, state, logs, actions } = await useCase.execute(
        req.user.id,
        handIndices,
        position,
        selectedFieldIndex
      );

      res.json({
        success,
        state: toClientState(state),
        logs,
        actions,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = FusionController;
