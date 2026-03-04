const { Router } = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const PackageController = require("#presentation/controllers/PackageController");

const router = Router();
const packageController = new PackageController();

// Lista todos os pacotes do usuário autenticado
router.get("/", authMiddleware, (req, res) => packageController.byUser(req, res));
// Abre um pacote específico (retorna cartas e deleta o pacote)
router.post("/:id/open", authMiddleware, (req, res) => packageController.open(req, res));

module.exports = router;
