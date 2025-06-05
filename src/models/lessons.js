"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lessons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lessons.belongsTo(models.Modules, {
        foreignKey: "moduleId",
        as: "Module",
      });
    }
  }
  Lessons.init(
    {
      moduleId: {
        type: DataTypes.BIGINT,
        field: "moduleId",
      },
      title: DataTypes.STRING,
      duration: DataTypes.TIME,
      completed: DataTypes.BOOLEAN,
      contentURL: DataTypes.STRING,
      contentData: DataTypes.TEXT,
      type: DataTypes.STRING,
      order: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Lessons",
    }
  );
  return Lessons;
};
