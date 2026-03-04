const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Store = sequelize.define(
	"Store",
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
		location: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "stores",
		underscored: true,
		timestamps: true,
	},
);

module.exports = Store;
