// server/src/models/flashcardCards.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FlashcardCards extends Model {
    static associate(models) {
      FlashcardCards.belongsTo(models.FlashcardDecks, {
        foreignKey: "deckId",
        as: "deck",
      });
      FlashcardCards.hasMany(models.FlashcardStudyLogs, {
        foreignKey: "cardId",
        as: "studyLogs",
      });
    }
  }
  FlashcardCards.init(
    {
      deckId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "new",
        allowNull: false,
      },
      stage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      interval: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      easeFactor: {
        type: DataTypes.FLOAT,
        defaultValue: 2.5,
        allowNull: false,
      },
      repetitions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      nextReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      cardSetTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "FlashcardCards",
      tableName: "FlashcardCards"
    }
  );
  return FlashcardCards;
};