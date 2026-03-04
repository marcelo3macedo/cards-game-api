const { Router } = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const PackageController = require("#presentation/controllers/PackageController");

const router = Router();
const packageController = new PackageController();

// Lista todos os pacotes do usuário autenticado
router.get("/", authMiddleware, (req, res) => packageController.byUser(req, res));

module.exports = router;
