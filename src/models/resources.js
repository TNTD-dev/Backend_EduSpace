"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Resources extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Resources.belongsTo(models.Courses, {
        foreignKey: "courseId",
        as: "course",
      });

      // Resource thuộc về Module (nếu có)
      Resources.belongsTo(models.Modules, {
        foreignKey: "moduleId",
        as: "module",
      });
    }
  }
  Resources.init(
    {
      courseId: {
        type: DataTypes.BIGINT,
        field: "courseId",
      },
      moduleId: {
        type: DataTypes.BIGINT,
        field: "moduleId",
      },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      fileURL: DataTypes.STRING,
      fileName: DataTypes.STRING,
      mimeType: DataTypes.STRING,
      fileSize: DataTypes.INTEGER,
      uploadedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Resources",
    }
  );
  return Resources;
};
