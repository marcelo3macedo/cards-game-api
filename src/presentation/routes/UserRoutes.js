const { Router } = require("express");
const SequelizeUserRepository = require("../../infrastructure/repositories/SequelizeUserRepository");
const CreateUser = require("../../core/use-cases/user/CreateUser");
const GetUserByToken = require("../../core/use-cases/user/GetUserByToken");
const authMiddleware = require("../../middleware/authMiddleware");

const router = Router();
const userRepository = new SequelizeUserRepository();

router.post("/", async (req, res) => {
	try {
		const useCase = new CreateUser(userRepository);
		const user = await useCase.execute(req.body);
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.get("/me", authMiddleware, async (req, res) => {
	try {
		const useCase = new GetUserByToken(userRepository);
		const user = await useCase.execute(req.token);
		res.json(user);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

module.exports = router;
