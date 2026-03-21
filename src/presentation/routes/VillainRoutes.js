const { Router } = require("express");
const VillainController = require("#presentation/controllers/VillainController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = Router();
const villainController = new VillainController();

router.get("/", authMiddleware, (req, res) => villainController.all(req, res));
router.post("/", (req, res) => villainController.create(req, res));

module.exports = router;
