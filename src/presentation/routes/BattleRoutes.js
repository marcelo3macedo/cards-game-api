const { Router } = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const BattleController = require("#presentation/controllers/BattleController");

const router = Router();
const battleController = new BattleController();

router.get("/", authMiddleware, (req, res) => battleController.recover(req, res));
router.post("/", authMiddleware, (req, res) => battleController.create(req, res));

module.exports = router;
