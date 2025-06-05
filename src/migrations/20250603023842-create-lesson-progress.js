"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("LessonProgresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studentId: {
        type: Sequelize.BIGINT,
      },
      courseId: {
        type: Sequelize.BIGINT,
      },
      moduleId: {
        type: Sequelize.BIGINT,
      },
      status: {
        type: Sequelize.ENUM("notStarted", "inProgress", "completed"),
        defaultValue: "notStarted",
      },
      completedAt: {
        type: Sequelize.DATE,
      },
      score: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("LessonProgresses");
  },
};
