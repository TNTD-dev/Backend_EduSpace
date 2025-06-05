"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("assignmentSubmissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      assignmentId: {
        type: Sequelize.BIGINT,
      },
      moduleId: {
        type: Sequelize.BIGINT,
      },
      studentId: {
        type: Sequelize.BIGINT,
      },
      fileURL: {
        type: Sequelize.STRING,
      },
      fileName: {
        type: Sequelize.STRING,
      },
      mimeType: {
        type: Sequelize.STRING,
      },
      fileSize: {
        type: Sequelize.INTEGER,
      },
      textContent: {
        type: Sequelize.TEXT,
      },
      submittedAt: {
        type: Sequelize.DATE,
      },
      isLate: {
        type: Sequelize.BOOLEAN,
      },
      grade: {
        type: Sequelize.FLOAT,
      },
      feedback: {
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
    await queryInterface.dropTable("assignmentSubmissions");
  },
};
