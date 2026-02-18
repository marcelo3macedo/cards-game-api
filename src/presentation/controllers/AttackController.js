const HandleAttack = require("#core/use-cases/battle/actions/HandleAttack");

class AttackController {
  async handlerAttack(req, res) {
    try {
      const { attackerIdx, targetIdx } = req.body;
      const useCase = new HandleAttack();
      const newState = await useCase.execute(req.user.id, "player", attackerIdx, targetIdx);
      res.json(newState);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AttackController;
