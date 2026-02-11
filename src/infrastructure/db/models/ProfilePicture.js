const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const ProfilePicture = sequelize.define(
	"ProfilePicture",
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
		type: {
			type: DataTypes.ENUM("boy", "girl"),
			allowNull: false,
		},
		imageUrl: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "profile_pictures",
		timestamps: true,
		underscored: true,
	},
);

module.exports = ProfilePicture;
