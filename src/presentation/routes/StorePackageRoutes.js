const { Router } = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const StorePackageController = require("#presentation/controllers/StorePackageController");

const router = Router();
const ctrl = new StorePackageController();

router.get("/", (req, res) => ctrl.all(req, res));
router.post("/", (req, res) => ctrl.create(req, res));
router.post("/:id/buy", authMiddleware, (req, res) => ctrl.buy(req, res));

module.exports = router;
