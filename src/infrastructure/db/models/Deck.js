const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./User");
const Card = require("./Card");
const Villain = require("./Villain");

const Deck = sequelize.define(
	"Deck",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			references: { model: User, key: "id" },
		},
		villainId: {
			type: DataTypes.INTEGER,
			references: { model: Villain, key: "id" },
		},
		cardId: {
			type: DataTypes.INTEGER,
			references: { model: Card, key: "id" },
		},
		type: {
			type: DataTypes.ENUM("main", "library", "initial"),
			allowNull: false,
			defaultValue: "library",
		},
	},
	{
		tableName: "decks",
		underscored: true,
		timestamps: true,
	},
);

// Relacionamentos
Deck.belongsTo(Card, { foreignKey: "cardId", as: "card" });
User.hasMany(Deck, { foreignKey: "userId", as: "userCards" });

module.exports = Deck;
