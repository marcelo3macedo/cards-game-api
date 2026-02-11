const { Router } = require("express");
const SequelizeBattleRepository = require("../../infrastructure/repositories/SequelizeBattleRepository");
const RegisterBattle = require("../../core/use-cases/battle/RegisterBattle");

const router = Router();
const battleRepository = new SequelizeBattleRepository();

// GET - Histórico de um usuário
router.get("/user/:userId", async (req, res) => {
	try {
		const history = await battleRepository.findByUserId(req.params.userId);
		res.json(history);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// POST - Registrar nova batalha
router.post("/", async (req, res) => {
	try {
		const useCase = new RegisterBattle(battleRepository);
		const result = await useCase.execute(req.body);
		res.status(201).json(result);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
