const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Card = sequelize.define(
	"Card",
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
			allowNull: false,
		},
		imageUrl: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		element: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		attribute: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		stars: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			validate: {
				min: 1,
				max: 12,
			},
		},
		attackPower: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		defensePower: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		effectScript: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		effectValue: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		tableName: "cards",
		underscored: true,
		timestamps: true,
	},
);

module.exports = Card;
