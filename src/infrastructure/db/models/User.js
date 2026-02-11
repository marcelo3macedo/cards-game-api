const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const ProfilePicture = require("./ProfilePicture");

const User = sequelize.define(
	"User",
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
		token: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		profilePictureId: {
			type: DataTypes.INTEGER,
			references: {
				model: ProfilePicture,
				key: "id",
			},
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		points: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		tableName: "users",
		underscored: true,
	},
);

User.belongsTo(ProfilePicture, {
	foreignKey: "profilePictureId",
	as: "profile",
});

module.exports = User;
