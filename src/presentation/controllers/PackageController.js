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
}

module.exports = PackageController;
