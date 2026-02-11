const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./User");
const Villain = require("./Villain");

const BattleHistory = sequelize.define(
	"BattleHistory",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		date: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		userId: {
			type: DataTypes.INTEGER,
			references: { model: User, key: "id" },
		},
		villainId: {
			type: DataTypes.INTEGER,
			references: { model: Villain, key: "id" },
		},
		status: {
			type: DataTypes.ENUM("victory", "lose"),
			allowNull: false,
		},
		stars: {
			type: DataTypes.INTEGER,
			defaultValue: 0, // Quantidade de estrelas ganhas na luta
		},
		// Armazena um array de IDs das cartas ganhas: [1, 5, 10]
		cardsAcquired: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: [],
		},
	},
	{
		tableName: "battle_histories",
		underscored: true,
		timestamps: false, // Já usamos o campo 'date'
	},
);

// Relacionamentos para facilitar o GET
BattleHistory.belongsTo(User, { foreignKey: "userId", as: "user" });
BattleHistory.belongsTo(Villain, { foreignKey: "villainId", as: "villain" });

module.exports = BattleHistory;
