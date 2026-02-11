const { Router } = require("express");
const SequelizeDeckRepository = require("../../infrastructure/repositories/SequelizeDeckRepository");
const ManageDeck = require("../../core/use-cases/deck/ManageDeck");
const authMiddleware = require("../../middleware/authMiddleware");
const GetUserByToken = require("../../core/use-cases/user/GetUserByToken");
const SequelizeUserRepository = require("../../infrastructure/repositories/SequelizeUserRepository");

const router = Router();
const userRepository = new SequelizeUserRepository();
const deckRepository = new SequelizeDeckRepository();

router.get("/", authMiddleware, async (req, res) => {
	try {
		const useUserCase = new GetUserByToken(userRepository);
		const user = await useUserCase.execute(req.token);

		const useCase = new ManageDeck(deckRepository);
		const deckInfo = await useCase.getPlayerDeckInfo(user.id);
		res.json(deckInfo);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/:userId", async (req, res) => {
	try {
		const useCase = new ManageDeck(deckRepository);
		const deckInfo = await useCase.getPlayerDeckInfo(req.params.userId);
		res.json(deckInfo);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/:userId/shuffle", async (req, res) => {
	try {
		const useCase = new ManageDeck(deckRepository);
		const shuffledDeck = await useCase.shuffleAndGetMain(req.params.userId);
		res.json(shuffledDeck);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
