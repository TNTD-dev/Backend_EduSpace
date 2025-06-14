// server/src/migrations/flashcardStudyLogsMigration.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FlashcardStudyLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Status of the review (correct, incorrect, etc.)"
      },
      stage: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Current learning stage of the card"
      },
      interval: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Interval in days until next review"
      },
      easeFactor: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 2.5,
        comment: "Ease factor for spaced repetition algorithm"
      },
      nextReviewDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Next scheduled review date"
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
    await queryInterface.addIndex("FlashcardStudyLogs", ["cardId"]);
    await queryInterface.addIndex("FlashcardStudyLogs", ["userId"]);
    await queryInterface.addIndex("FlashcardStudyLogs", ["nextReviewDate"]);
    await queryInterface.addIndex("FlashcardStudyLogs", ["createdAt"]);
    await queryInterface.addIndex("FlashcardStudyLogs", ["status"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FlashcardStudyLogs");
  },
};