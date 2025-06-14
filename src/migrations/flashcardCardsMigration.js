"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FlashcardCards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      deckId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "FlashcardDecks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "new",
        allowNull: false,
      },
      stage: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      interval: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      easeFactor: {
        type: Sequelize.FLOAT,
        defaultValue: 2.5,
        allowNull: false,
      },
      repetitions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      nextReviewDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      lastReviewDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex("FlashcardCards", ["deckId"]);
    await queryInterface.addIndex("FlashcardCards", ["status"]);
    await queryInterface.addIndex("FlashcardCards", ["nextReviewDate"]);
    await queryInterface.addIndex("FlashcardCards", ["order"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FlashcardCards");
  },
}; 