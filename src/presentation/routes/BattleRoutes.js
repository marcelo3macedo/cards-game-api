const { Router } = require("express");
const SequelizeBattleRepository = require("../../infrastructure/repositories/SequelizeBattleRepository");
const RegisterBattle = require("../../core/use-cases/battle/RegisterBattle");
const authMiddleware = require("../../middleware/authMiddleware");
const SequelizeDeckRepository = require("../../infrastructure/repositories/SequelizeDeckRepository");
const SequelizeVillainRepository = require("../../infrastructure/repositories/SequelizeVillainRepository");

const router = Router();
const battleRepository = new SequelizeBattleRepository();
const deckRepository = new SequelizeDeckRepository();
const villainRepository = new SequelizeVillainRepository();

router.get("/", authMiddleware, async (req, res) => {
	try {
		const history = await battleRepository.findByUserId(req.params.userId);
		res.json(history);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/", authMiddleware, async (req, res) => {
	try {
		const useCase = new RegisterBattle(battleRepository, deckRepository, villainRepository);
		const result = await useCase.execute(req.user.id);
		res.status(201).json(result);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
