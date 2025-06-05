"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AssignmentFeedbacks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      assignmentId: {
        type: Sequelize.BIGINT,
      },
      studentId: {
        type: Sequelize.BIGINT,
      },
      authorId: {
        type: Sequelize.BIGINT,
      },
      grade: {
        type: Sequelize.STRING,
      },
      comment: {
        type: Sequelize.TEXT,
      },
      strengths: {
        type: Sequelize.TEXT,
      },
      improvements: {
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
    await queryInterface.dropTable("AssignmentFeedbacks");
  },
};
