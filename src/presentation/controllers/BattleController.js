const DrawCard = require("#core/use-cases/battle/actions/DrawCard");
const StartBattle = require("#core/use-cases/battle/StartBattle");
const StartMockBattle = require("#core/use-cases/battle/StartMockBattle");
const SequelizeCardRepository = require("#infrastructure/repositories/SequelizeCardRepository");
const SequelizeDeckRepository = require("#infrastructure/repositories/SequelizeDeckRepository");
const SequelizeUserRepository = require("#infrastructure/repositories/SequelizeUserRepository");

class BattleController {
	constructor() {
		this.userRepo = new SequelizeUserRepository();
		this.villainRepo = new SequelizeCardRepository();
		this.deckRepo = new SequelizeDeckRepository();
	}

	async start(req, res) {
		try {
			const useCase = new StartBattle(this.userRepo, this.villainRepo, this.deckRepo);
            await useCase.execute(req.user, req.body.villainId);

            const action = new DrawCard();
            const stateWithHand = action.initialDraw(req.user.id);

            res.status(201).json(stateWithHand);
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
}

module.exports = BattleController;
