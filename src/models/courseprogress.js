"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CourseProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CourseProgress.belongsTo(models.Users, { foreignKey: "studentId" });
      CourseProgress.belongsTo(models.Courses, { foreignKey: "courseId" });
    }
  }
  CourseProgress.init(
    {
      studentId: DataTypes.BIGINT,
      courseId: DataTypes.BIGINT,
      status: {
        type: DataTypes.ENUM("notStarted", "inProgress", "completed"),
        defaultValue: "notStarted",
      },
      completedAt: DataTypes.DATE,
      score: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "CourseProgress",
    }
  );
  return CourseProgress;
};
