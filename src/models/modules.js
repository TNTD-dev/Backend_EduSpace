"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Modules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Modules.belongsTo(models.Courses, {
        foreignKey: "courseId",
        as: "Course",
      });

      Modules.hasMany(models.Lessons, {
        foreignKey: "moduleId",
        as: "Lessons",
      });
    }
  }
  Modules.init(
    {
      courseId: {
        type: DataTypes.INTEGER,
        field: "courseId",
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      order: DataTypes.INTEGER,
      imageURL: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Modules",
    }
  );
  return Modules;
};
