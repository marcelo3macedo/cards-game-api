const CreateUser = require("#core/use-cases/user/CreateUser");
const GetUserByToken = require("#core/use-cases/user/GetUserByToken");
const SequelizeDeckRepository = require("#infrastructure/repositories/SequelizeDeckRepository");
const SequelizeUserRepository = require("#infrastructure/repositories/SequelizeUserRepository");

class UserController {
	constructor() {
		this.userRepo = new SequelizeUserRepository();
		this.deckRepo = new SequelizeDeckRepository();
        this.createUser = new CreateUser(this.userRepo);
        this.getUserByToken = new GetUserByToken(this.userRepo);
	}

    async me(req, res) {
        try {
            const user = await this.getUserByToken.execute(req.token);
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const user = await this.createUser.execute(req.body);
            await this.deckRepo.createMainDeck(user.id);
            const baseUser = await this.userRepo.findByToken(user.token);

            res.status(201).json(baseUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = UserController;
