"use strict";
const { Model, ENUM } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LessonProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LessonProgress.belongsTo(models.Users, { foreignKey: "studentId" });
      LessonProgress.belongsTo(models.Courses, { foreignKey: "courseId" });
      LessonProgress.belongsTo(models.Modules, { foreignKey: "moduleId" });
      LessonProgress.belongsTo(models.Lessons, { foreignKey: "lessonId" });
    }
  }
  LessonProgress.init(
    {
      studentId: DataTypes.BIGINT,
      courseId: DataTypes.BIGINT,
      moduleId: DataTypes.BIGINT,
      status: {
        type: DataTypes.ENUM("notStarted", "inProgress", "completed"),
        defaultValue: "notStarted",
      },
      completedAt: DataTypes.DATE,
      score: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "LessonProgress",
    }
  );
  return LessonProgress;
};
