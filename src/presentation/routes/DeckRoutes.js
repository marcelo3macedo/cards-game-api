const { Router } = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const DeckController = require("#presentation/controllers/DeckController");

const router = Router();
const deckController = new DeckController();

router.get("/", authMiddleware, (req, res) => deckController.myInfo(req, res));
router.get("/:userId", (req, res) => deckController.getInfo(req, res));
router.get("/:userId/shuffle", (req, res) => deckController.shuffle(req, res));

module.exports = router;
