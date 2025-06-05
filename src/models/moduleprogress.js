"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ModuleProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ModuleProgress.belongsTo(models.Users, { foreignKey: "studentId" });
      ModuleProgress.belongsTo(models.Courses, { foreignKey: "courseId" });
      ModuleProgress.belongsTo(models.Modules, { foreignKey: "moduleId" });
    }
  }
  ModuleProgress.init(
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
      modelName: "ModuleProgress",
    }
  );
  return ModuleProgress;
};
