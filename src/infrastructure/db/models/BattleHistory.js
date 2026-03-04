const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./User");
const Villain = require("./Villain");
const Package = require("./Package");

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
			defaultValue: 0,
		},
		// Pacote de cartas recebido como premiação (apenas em vitória)
		packageId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: Package, key: "id" },
		},
	},
	{
		tableName: "battle_histories",
		underscored: true,
		timestamps: false, // Já usamos o campo 'date'
	},
);

BattleHistory.belongsTo(User, { foreignKey: "userId", as: "user" });
BattleHistory.belongsTo(Villain, { foreignKey: "villainId", as: "villain" });
BattleHistory.belongsTo(Package, { foreignKey: "packageId", as: "package" });

module.exports = BattleHistory;
