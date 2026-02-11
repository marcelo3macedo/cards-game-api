const { Router } = require("express");
const SequelizeVillainRepository = require("../../infrastructure/repositories/SequelizeVillainRepository");
const ListVillains = require("../../core/use-cases/ListVillains");

const router = Router();
const villainRepository = new SequelizeVillainRepository();

// GET all villains
router.get("/", async (req, res) => {
	try {
		const useCase = new ListVillains(villainRepository);
		const villains = await useCase.execute();
		res.json(villains);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// POST a new villain
router.post("/", async (req, res) => {
	try {
		const villain = await villainRepository.create(req.body);
		res.status(201).json(villain);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
