"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FlashCards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      setId: {
        type: Sequelize.BIGINT,
      },
      frontText: {
        type: Sequelize.TEXT,
      },
      backText: {
        type: Sequelize.TEXT,
      },
      imgURL: {
        type: Sequelize.TEXT,
      },
      audioURL: {
        type: Sequelize.TEXT,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FlashCards");
  },
};
