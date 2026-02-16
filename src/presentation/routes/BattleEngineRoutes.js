const { Router } = require("express");
const { asyncHandler } = require("../../utils/asyncHandler");
const router = Router();

const StartBattle = require("../../core/use-cases/battle/StartBattle");
const BattleAction = require("../../core/use-cases/battle/BattleAction");
const VillainTurn = require("../../core/use-cases/battle/VillainTurn");

const SequelizeUserRepository = require("../../infrastructure/repositories/SequelizeUserRepository");
const SequelizeVillainRepository = require("../../infrastructure/repositories/SequelizeVillainRepository");
const SequelizeDeckRepository = require("../../infrastructure/repositories/SequelizeDeckRepository");
const authMiddleware = require("../../middleware/authMiddleware");
const StartMockBattle = require("../../core/use-cases/battle/StartMockBattle");

const userRepo = new SequelizeUserRepository();
const villainRepo = new SequelizeVillainRepository();
const deckRepo = new SequelizeDeckRepository();

router.post("/start", authMiddleware, asyncHandler(async (req, res) => {
    const useCase = new StartBattle(userRepo, villainRepo, deckRepo);
    await useCase.execute(req.user, req.body.villainId);

    const action = new BattleAction();
    const stateWithHand = action.draw(req.user.id, 5);

    res.status(201).json(stateWithHand);
}));

router.post("/mock/start", authMiddleware, asyncHandler(async (req, res) => {
    const { battleState } = req.body;

    if (!battleState || !req.user.id) {
        return res.status(400).json({
            error: "state and userId are required"
        });
    }

    const mockBattle = new StartMockBattle();
    mockBattle.execute(req.user.id, battleState);

    res.status(201).json({
        message: "Mock battle saved",
        battleState
    });
}));

router.post("/draw", authMiddleware, asyncHandler(async (req, res) => {
    const action = new BattleAction();
    const newState = action.draw(req.user.id);
    res.json(newState);
}));

router.post("/change-position", authMiddleware, asyncHandler(async (req, res) => {
    const { fieldIndex, position } = req.body;

    if (fieldIndex === undefined) {
        throw new Error("fieldIndex is required");
    }

    const action = new BattleAction();
    const newState = action.changePosition(req.user.id, fieldIndex, position);
    res.json(newState);
}));

router.post("/summon", authMiddleware, asyncHandler(async (req, res) => {
    const { handIndex, position } = req.body;
    const action = new BattleAction();
    const newState = action.summon(req.user.id, handIndex, position);
    res.json(newState);
}));

router.post("/attack", authMiddleware, asyncHandler(async (req, res) => {
    const { attackerIdx, targetIdx } = req.body;
    const action = new BattleAction();
    const result = action.attack(req.user.id, attackerIdx, targetIdx);
    res.json(result);
}));

router.post("/end-turn", authMiddleware, asyncHandler(async (req, res) => {
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
}));

router.post("/activate-card", authMiddleware, asyncHandler(async (req, res) => {
    const { cardIndex, origin } = req.body;
    const action = new BattleAction();

    const activationResult = await action.prepareEffect(req.user.id, cardIndex, origin, "player");

    res.status(200).json(activationResult);
}));

router.post("/confirm-selection", authMiddleware, asyncHandler(async (req, res) => {
    const { handIndex, effectType, target } = req.body;

    const action = new BattleAction();
    const result = action.executeEffect(req.user.id, {
        handIndex,
        effectType,
        target
    });

    res.json(result);
}));

module.exports = router;
