const { Router } = require("express");
const router = Router();

const StartBattle = require("../../core/use-cases/battle/StartBattle");
const BattleAction = require("../../core/use-cases/battle/BattleAction");
const VillainTurn = require("../../core/use-cases/battle/VillainTurn");

const SequelizeUserRepository = require("../../infrastructure/repositories/SequelizeUserRepository");
const SequelizeVillainRepository = require("../../infrastructure/repositories/SequelizeVillainRepository");
const SequelizeDeckRepository = require("../../infrastructure/repositories/SequelizeDeckRepository");
const authMiddleware = require("../../middleware/authMiddleware");

const userRepo = new SequelizeUserRepository();
const villainRepo = new SequelizeVillainRepository();
const deckRepo = new SequelizeDeckRepository();

router.post("/start", authMiddleware, async (req, res) => {
	try {
		const useCase = new StartBattle(userRepo, villainRepo, deckRepo);
		await useCase.execute(
			req.user,
			req.body.villainId,
		);

		const action = new BattleAction();
        const stateWithHand = action.draw(req.user.id, 5);

        res.status(201).json(stateWithHand);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.post("/draw", authMiddleware, async (req, res) => {
	try {
		const action = new BattleAction();
		const newState = action.draw(req.user.id);
		res.json(newState);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.post("/change-position", authMiddleware, async (req, res) => {
    try {
        const { fieldIndex } = req.body;
        const action = new BattleAction();

        if (fieldIndex === undefined) {
            return res.status(400).json({ error: "fieldIndex is required" });
        }

        const newState = action.changePosition(req.user.id, fieldIndex);
        res.json(newState);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/summon", authMiddleware, async (req, res) => {
	try {
		const { handIndex, position } = req.body;
		const action = new BattleAction();
		const newState = action.summon(req.user.id, handIndex, position);
		res.json(newState);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.post("/attack", authMiddleware, async (req, res) => {
	try {
		const { attackerIdx, targetIdx } = req.body;
		const action = new BattleAction();
		const result = action.attack(req.user.id, attackerIdx, targetIdx);
		res.json(result);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.post("/end-turn", authMiddleware, async (req, res) => {
	try {
		const action = new BattleAction();

		action.nextTurn(req.user.id);

		const villainAI = new VillainTurn();
		const result = await villainAI.execute(req.user.id);

		res.json({
			message: "Turno do jogador finalizado. Vilão jogou.",
			logs: result.logs,
			actions: result.actions,
			state: result.state,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
