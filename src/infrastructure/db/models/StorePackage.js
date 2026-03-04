const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Store = require("./Store");

// Pacotes disponíveis para compra em uma loja (catálogo)
const StorePackage = sequelize.define(
	"StorePackage",
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
		description: {
			type: DataTypes.TEXT,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		requiredLevel: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		cardCount: {
			type: DataTypes.INTEGER,
			defaultValue: 3,
		},
		storeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: Store, key: "id" },
		},
	},
	{
		tableName: "store_packages",
		underscored: true,
		timestamps: true,
	},
);

StorePackage.belongsTo(Store, { foreignKey: "storeId", as: "store" });

module.exports = StorePackage;
