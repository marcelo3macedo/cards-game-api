const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./User");
const Villain = require("./Villain");
const Store = require("./Store");

const Package = sequelize.define(
	"Package",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// Origem do pacote: ganho de duelo ou comprado em loja
		type: {
			type: DataTypes.ENUM("villain", "store"),
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: User, key: "id" },
		},
		// Preenchido quando type = "villain"
		villainId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: Villain, key: "id" },
		},
		// Preenchido quando type = "store"
		storeId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: Store, key: "id" },
		},
		// Array de IDs das cartas contidas no pacote: [1, 5, 10]
		cards: {
			type: DataTypes.JSON,
			allowNull: false,
			defaultValue: [],
		},
	},
	{
		tableName: "packages",
		underscored: true,
		timestamps: true,
	},
);

Package.belongsTo(User, { foreignKey: "userId", as: "user" });
Package.belongsTo(Villain, { foreignKey: "villainId", as: "villain" });
Package.belongsTo(Store, { foreignKey: "storeId", as: "store" });

module.exports = Package;
