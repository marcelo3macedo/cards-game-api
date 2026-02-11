const { Router } = require("express");
const SequelizeProfileRepository = require("../../infrastructure/repositories/SequelizeProfileRepository");
const ListProfilePictures = require("../../core/use-cases/ListProfilePictures");

const router = Router();
const profileRepository = new SequelizeProfileRepository();

router.get("/", async (req, res) => {
	try {
		const { type } = req.query;
		const useCase = new ListProfilePictures(profileRepository);
		const profiles = await useCase.execute(type);

		res.json(profiles);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
