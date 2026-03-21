const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const ChapterArea = require("./ChapterArea");

const ChapterCardType = sequelize.define(
	"ChapterCardType",
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
		rarity: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		cardClass: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		areaId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "chapter_areas", key: "id" },
		},
		order: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		tableName: "chapter_card_types",
		underscored: true,
		timestamps: true,
	},
);

ChapterCardType.belongsTo(ChapterArea, { foreignKey: "areaId", as: "area" });
ChapterArea.hasMany(ChapterCardType, { foreignKey: "areaId", as: "cardTypes" });

module.exports = ChapterCardType;
