"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AssignmentFeedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AssignmentFeedback.init(
    {
      assignmentId: {
        type: DataTypes.BIGINT,
        field: "assignmentId",
      },
      studentId: {
        type: DataTypes.BIGINT,
        field: "studentId",
      },
      authorId: {
        type: DataTypes.BIGINT,
        field: "authorId",
      },
      grade: DataTypes.STRING,
      comment: DataTypes.TEXT,
      strengths: DataTypes.TEXT,
      improvements: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "AssignmentFeedback",
    }
  );
  return AssignmentFeedback;
};
