const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Chapter = require("./Chapter");

const ChapterArea = sequelize.define(
	"ChapterArea",
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
		chapterId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "chapters", key: "id" },
		},
		order: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		tableName: "chapter_areas",
		underscored: true,
		timestamps: true,
	},
);

ChapterArea.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });
Chapter.hasMany(ChapterArea, { foreignKey: "chapterId", as: "areas" });

module.exports = ChapterArea;
