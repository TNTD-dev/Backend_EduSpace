// server/src/models/flashcardStudyLogs.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FlashcardStudyLogs extends Model {
    static associate(models) {
      FlashcardStudyLogs.belongsTo(models.FlashcardCards, {
        foreignKey: "cardId",
        as: "card",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      FlashcardStudyLogs.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
  }
  FlashcardStudyLogs.init(
    {
      cardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'FlashcardCards',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Status of the review (correct, incorrect, etc.)"
      },
      stage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Current learning stage of the card"
      },
      interval: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Interval in days until next review"
      },
      easeFactor: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 2.5,
        comment: "Ease factor for spaced repetition algorithm"
      },
      nextReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Next scheduled review date"
      }
    },
    {
      sequelize,
      modelName: "FlashcardStudyLogs",
      tableName: "FlashcardStudyLogs",
      indexes: [
        {
          fields: ['cardId']
        },
        {
          fields: ['userId']
        },
        {
          fields: ['nextReviewDate']
        },
        {
          fields: ['createdAt']
        },
        {
          fields: ['status']
        }
      ]
    }
  );
  return FlashcardStudyLogs;
};