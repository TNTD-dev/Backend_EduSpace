"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class assignmentSubmission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      assignmentSubmission.belongsTo(models.Users, {
        foreignKey: "studentId",
        as: "student",
      });

      assignmentSubmission.belongsTo(models.Modules, {
        foreignKey: "moduleId",
        as: "module",
      });

      assignmentSubmission.belongsTo(models.Assignments, {
        foreignKey: "assignmentId",
        as: "assignment",
      });
    }
  }
  assignmentSubmission.init(
    {
      assignmentId: DataTypes.BIGINT,
      moduleId: DataTypes.BIGINT,
      studentId: DataTypes.BIGINT,
      fileURL: DataTypes.STRING,
      fileName: DataTypes.STRING,
      mimeType: DataTypes.STRING,
      fileSize: DataTypes.INTEGER,
      textContent: DataTypes.TEXT,
      submittedAt: DataTypes.DATE,
      isLate: DataTypes.BOOLEAN,
      grade: DataTypes.FLOAT,
      feedback: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "assignmentSubmission",
    }
  );
  return assignmentSubmission;
};
