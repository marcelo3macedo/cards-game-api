const { Router } = require("express");
const StoreController = require("#presentation/controllers/StoreController");

const router = Router();
const storeController = new StoreController();

router.get("/", (req, res) => storeController.all(req, res));
router.post("/", (req, res) => storeController.create(req, res));

module.exports = router;
