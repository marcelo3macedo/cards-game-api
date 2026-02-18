const { Router } = require("express");
const router = Router();

const authMiddleware = require("../../middleware/authMiddleware");
const DrawController = require("../controllers/DrawController");
const SummonController = require("../controllers/SummonController");
const AttackController = require("../controllers/AttackController");
const CardController = require("../controllers/CardController");
const BattleController = require("../controllers/BattleController");
const SequelizeCardRepository = require("#infrastructure/repositories/SequelizeCardRepository");
const EndTurnController = require("#presentation/controllers/EndTurnController");

const cardRepository = new SequelizeCardRepository();
const drawController = new DrawController();
const summonController = new SummonController();
const attackController = new AttackController();
const cardController = new CardController(cardRepository);
const battleController = new BattleController();
const endTurnController = new EndTurnController();

router.post("/start", authMiddleware, (req, res) => battleController.start(req, res));
router.post("/mock/start", authMiddleware, (req, res) => battleController.mock(req, res));
router.post("/draw", authMiddleware, (req, res) => drawController.handleDraw(req, res));
router.post("/summon", authMiddleware, (req, res) => summonController.handleSummon(req, res));
router.post("/attack", authMiddleware, (req, res) => attackController.handlerAttack(req, res));
router.post("/change-position", authMiddleware, (req, res) => cardController.changePosition(req, res));
router.post("/end-turn", authMiddleware, (req, res) => endTurnController.handle(req, res));
router.post("/activate-card", authMiddleware, (req, res) => cardController.activate(req, res));
router.post("/confirm-selection", authMiddleware, (req, res) => cardController.confirmSelection(req, res));

module.exports = router;
