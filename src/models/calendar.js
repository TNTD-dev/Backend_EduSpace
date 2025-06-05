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
    }
  }
  Calendar.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      createdDate: DataTypes.DATE,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      tag: {
        type: DataTypes.ENUM(
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
      userId: DataTypes.BIGINT,
      courseId: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "Calendar",
    }
  );
  return Calendar;
};
