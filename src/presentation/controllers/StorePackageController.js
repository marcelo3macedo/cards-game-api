const BuyPackage = require("#core/use-cases/store/BuyPackage");
const SequelizeCardRepository = require("#infrastructure/repositories/SequelizeCardRepository");
const SequelizeDeckRepository = require("#infrastructure/repositories/SequelizeDeckRepository");
const SequelizePackageRepository = require("#infrastructure/repositories/SequelizePackageRepository");
const SequelizeStorePackageRepository = require("#infrastructure/repositories/SequelizeStorePackageRepository");
const SequelizeUserRepository = require("#infrastructure/repositories/SequelizeUserRepository");

class StorePackageController {
	constructor() {
		this.storePackageRepo = new SequelizeStorePackageRepository();
		this.userRepo = new SequelizeUserRepository();
		this.cardRepo = new SequelizeCardRepository();
		this.packageRepo = new SequelizePackageRepository();
		this.deckRepo = new SequelizeDeckRepository();
	}

	// GET /store-packages — lista todos os pacotes disponíveis
	async all(req, res) {
		try {
			const packages = await this.storePackageRepo.findAll();
			res.json(packages);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	// POST /store-packages — cria um pacote no catálogo (uso admin)
	async create(req, res) {
		try {
			const pkg = await this.storePackageRepo.create(req.body);
			res.status(201).json(pkg);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	// POST /store-packages/:id/buy — compra um pacote
	async buy(req, res) {
		try {
			const useCase = new BuyPackage(
				this.userRepo,
				this.storePackageRepo,
				this.cardRepo,
				this.packageRepo,
				this.deckRepo,
			);
			const result = await useCase.execute(req.user.id, req.params.id);
			res.status(201).json(result);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
}

module.exports = StorePackageController;
