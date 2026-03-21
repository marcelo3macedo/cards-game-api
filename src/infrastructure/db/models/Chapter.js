const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Chapter = sequelize.define(
	"Chapter",
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
			allowNull: true,
		},
		unlockVillainId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: "villains", key: "id" },
		},
		order: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		tableName: "chapters",
		underscored: true,
		timestamps: true,
	},
);

module.exports = Chapter;
