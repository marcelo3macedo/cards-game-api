const { Router } = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const UserController = require("#presentation/controllers/UserController");

const router = Router();
const userController = new UserController();

router.post("/", (req, res) => userController.create(req, res));
router.get("/me", authMiddleware, (req, res) => userController.me(req, res));

module.exports = router;
