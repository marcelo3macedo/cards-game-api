const CreateUser = require("#core/use-cases/user/CreateUser");
const GetUserByToken = require("#core/use-cases/user/GetUserByToken");
const SequelizeUserRepository = require("#infrastructure/repositories/SequelizeUserRepository");

class UserController {
	constructor() {
		this.userRepo = new SequelizeUserRepository();
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
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = UserController;
