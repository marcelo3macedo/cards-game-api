const { toClientState } = require("#core/domain/services/BattleViewMapper");
const DrawCard = require("#core/use-cases/battle/actions/DrawCard");
const RegisterBattle = require("#core/use-cases/battle/RegisterBattle");
const StartBattle = require("#core/use-cases/battle/StartBattle");
const StartMockBattle = require("#core/use-cases/battle/StartMockBattle");
const SequelizeBattleRepository = require("#infrastructure/repositories/SequelizeBattleRepository");
const SequelizeDeckRepository = require("#infrastructure/repositories/SequelizeDeckRepository");
const SequelizePackageRepository = require("#infrastructure/repositories/SequelizePackageRepository");
const SequelizeUserRepository = require("#infrastructure/repositories/SequelizeUserRepository");
const SequelizeVillainRepository = require("#infrastructure/repositories/SequelizeVillainRepository");

class BattleController {
	constructor() {
		this.userRepo = new SequelizeUserRepository();
		this.villainRepo = new SequelizeVillainRepository();
		this.deckRepo = new SequelizeDeckRepository();
		this.battleRepo = new SequelizeBattleRepository();
		this.packageRepo = new SequelizePackageRepository();
	}

	async start(req, res) {
		try {
			const useCase = new StartBattle(this.userRepo, this.villainRepo, this.deckRepo);
            await useCase.execute(req.user, req.body.villainId);

            const action = new DrawCard();
            const { success, drawnCount, state, logs, actions } = action.initialDraw(req.user.id, "player");

            res.status(201).json({
                success,
                drawnCount,
                state: toClientState(state),
                logs,
                actions
            });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async mock(req, res) {
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
    }

	async create(req, res) {
		try {
			const useCase = new RegisterBattle(this.battleRepo, this.deckRepo, this.villainRepo, this.packageRepo);
			const result = await useCase.execute(req.user.id);
			res.status(201).json(result);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

    async recover(req, res) {
        try {
            const history = await this.battleRepo.findByUserId(req.user.id);
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = BattleController;
