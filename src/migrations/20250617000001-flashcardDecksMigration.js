// server/src/migrations/flashcardDecksMigration.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FlashcardDecks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cardCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      dueCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      lastStudied: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex("FlashcardDecks", ["userId"]);
    await queryInterface.addIndex("FlashcardDecks", ["name"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FlashcardDecks");
  },
};