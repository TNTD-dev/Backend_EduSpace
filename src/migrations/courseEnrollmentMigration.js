"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CoursesEnrollments", {
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
      studentId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      enrollmentDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total: {
        type: Sequelize.INTEGER,
        defaultValue: 100,
      },
      grade: {
        type: Sequelize.STRING(2),
        allowNull: true,
      },
      lastAccessed: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completionDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CoursesEnrollments");
  },
};
