"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Calendars", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      createdDate: {
        type: Sequelize.DATE,
      },
      startTime: {
        type: Sequelize.DATE,
      },
      endTime: {
        type: Sequelize.DATE,
      },
      tag: {
        type: Sequelize.ENUM(
          "webDesign",
          "3DModeling",
          "software",
          "design",
          "Development",
          "meeting",
          "review",
          "planning",
          "testing",
          "deployment"
        ),
      },
      userId: Sequelize.BIGINT,
      courseId: Sequelize.BIGINT,
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
    await queryInterface.dropTable("Calendars");
  },
};
