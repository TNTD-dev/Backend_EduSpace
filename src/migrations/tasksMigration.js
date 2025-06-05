"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.BIGINT,
      },
      title: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.TIME,
      },
      category: {
        type: Sequelize.STRING,
      },
      icon: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      priority: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      dudeDate: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Tasks");
  },
};
