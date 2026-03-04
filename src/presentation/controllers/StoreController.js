const SequelizeStoreRepository = require("#infrastructure/repositories/SequelizeStoreRepository");

class StoreController {
	constructor() {
		this.storeRepo = new SequelizeStoreRepository();
	}

	async all(req, res) {
		try {
			const stores = await this.storeRepo.findAll();
			res.json(stores);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async create(req, res) {
		try {
			const store = await this.storeRepo.create(req.body);
			res.status(201).json(store);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
}

module.exports = StoreController;
