require("module-alias/register");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./src/infrastructure/db/sequelize");
const cardRoutes = require("./src/presentation/routes/CardRoutes");
const profileRoutes = require("./src/presentation/routes/ProfileRoutes");
const userRoutes = require("./src/presentation/routes/UserRoutes");
const villainRoutes = require("./src/presentation/routes/VillainRoutes");
const deckRoutes = require("./src/presentation/routes/DeckRoutes");
const battleRoutes = require("./src/presentation/routes/BattleRoutes");
const battleEngineRoutes = require("./src/presentation/routes/BattleEngineRoutes");
const storeRoutes = require("./src/presentation/routes/StoreRoutes");
const packageRoutes = require("./src/presentation/routes/PackageRoutes");

const app = express();

app.use(cors({
    origin: ["https://card-game.professoraantenada.com.br", "http://localhost:6006", "https://cardgame.alemdoscript.com.br"] ,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

app.use("/cards", cardRoutes);
app.use("/profile-pictures", profileRoutes);
app.use("/users", userRoutes);
app.use("/villains", villainRoutes);
app.use("/decks", deckRoutes);
app.use("/battles", battleRoutes);
app.use("/battle-engine", battleEngineRoutes);
app.use("/stores", storeRoutes);
app.use("/packages", packageRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: err.message || "Erro interno do servidor"
    });
});

const PORT = process.env.PORT || 3000;

sequelize
	.authenticate()
	.then(() => {
		console.log(`✅ Conectado ao MySQL (${process.env.DB_HOST})`);
		return sequelize.sync();
	})
	.then(() => {
		app.listen(PORT, () => {
			console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error("❌ Erro de conexão:", err);
	});
