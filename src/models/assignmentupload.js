"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AssignmentUpload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AssignmentUpload.belongsTo(models.Assignments, {
        foreignKey: "assignmentId",
        as: "assignment",
      });
    }
  }
  AssignmentUpload.init(
    {
      assignmentId: DataTypes.BIGINT,
      fileURL: DataTypes.STRING,
      fileName: DataTypes.STRING,
      mimeType: DataTypes.STRING,
      fileSize: DataTypes.INTEGER,
      uploadedAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "AssignmentUpload",
    }
  );
  return AssignmentUpload;
};
