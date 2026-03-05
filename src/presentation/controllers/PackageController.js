const SequelizePackageRepository = require("#infrastructure/repositories/SequelizePackageRepository");

class PackageController {
	constructor() {
		this.packageRepo = new SequelizePackageRepository();
	}

	async byUser(req, res) {
		try {
			const packages = await this.packageRepo.findByUserId(req.user.id);
			res.json(packages);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async open(req, res) {
		try {
			const pkg = await this.packageRepo.findByIdWithCards(Number(req.params.id));
			if (!pkg) return res.status(404).json({ error: "Pacote não encontrado." });
			if (pkg.userId !== req.user.id) return res.status(403).json({ error: "Acesso negado." });
			await this.packageRepo.deleteById(pkg.id);
			res.json({ package: pkg });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = PackageController;
