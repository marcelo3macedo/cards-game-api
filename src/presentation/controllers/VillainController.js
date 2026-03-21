const ListVillains = require("#core/use-cases/ListVillains");
const SequelizeVillainRepository = require("#infrastructure/repositories/SequelizeVillainRepository");

class VillainController {
	constructor() {
		this.villainRepo = new SequelizeVillainRepository();
        this.listVillains = new ListVillains(this.villainRepo);
	}

    async all(req, res) {
        try {
            const userId = req.user?.id ?? null;
            const villains = await this.listVillains.execute(userId);
            res.json(villains);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const villain = await this.villainRepo.create(req.body);
            res.status(201).json(villain);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = VillainController;
