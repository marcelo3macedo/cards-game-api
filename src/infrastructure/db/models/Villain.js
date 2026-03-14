const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Chapter = require("./Chapter");

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
		chapterId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: "chapters", key: "id" },
		},
	},
	{
		tableName: "villains",
		underscored: true,
		timestamps: true,
	},
);

Villain.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });
Chapter.hasMany(Villain, { foreignKey: "chapterId", as: "villains" });

// Chapter pode ter um vilão que precisa ser derrotado para desbloqueá-lo
Chapter.belongsTo(Villain, { foreignKey: "unlockVillainId", as: "unlockVillain" });

module.exports = Villain;
