"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Calendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Calendar belongs to a User
      Calendar.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "user",
      });
      // Calendar belongs to a Course
      Calendar.belongsTo(models.Courses, {
        foreignKey: "courseId",
        as: "course",
      });
      // Calendar belongs to a Tag
      Calendar.belongsTo(models.Tags, {
        foreignKey: "tagId",
        as: "tag",
      });
    }
  }
  Calendar.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Calendar",
    }
  );
  return Calendar;
};