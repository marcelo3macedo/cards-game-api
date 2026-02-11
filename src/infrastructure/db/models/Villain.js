const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Villain = sequelize.define(
	"Villain",
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
		profilePictureUrl: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		happyQuote: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		angerQuote: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: "villains",
		underscored: true,
		timestamps: true,
	},
);

module.exports = Villain;
