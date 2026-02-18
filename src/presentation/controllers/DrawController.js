const DrawCard = require("../../core/use-cases/battle/actions/DrawCard");

class DrawController {
  async handleDraw(req, res) {
    try {
      const useCase = new DrawCard();
      const newState = await useCase.execute(req.user.id, "player");

      res.json(newState);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = DrawController;
