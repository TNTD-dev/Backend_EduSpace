"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Lessons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      moduleId: {
        type: Sequelize.BIGINT,
      },
      title: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.TIME,
      },
      type: {
        type: Sequelize.ENUM("video", "document", "quiz"),
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      contentData: {
        type: Sequelize.TEXT,
      },
      completed: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("Lessons");
  },
};
