"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Resources", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      courseId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      moduleId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileURL: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mimeType: {
        type: Sequelize.STRING,
      },
      fileSize: {
        type: Sequelize.INTEGER,
      },
      uploadedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Resources");
  },
};
