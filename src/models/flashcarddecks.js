// server/src/models/flashcardDecks.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FlashcardDecks extends Model {
    static associate(models) {
      FlashcardDecks.hasMany(models.FlashcardCards, {
        foreignKey: "deckId",
        as: "cards",
      });
    }
  }
  FlashcardDecks.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cardCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      dueCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lastStudied: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "FlashcardDecks",
    }
  );
  return FlashcardDecks;
};