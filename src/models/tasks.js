"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tasks.init(
    {
      userId: {
        type: DataTypes.BIGINT,
        field: "userId",
      },
      title: DataTypes.STRING,
      time: DataTypes.TIME,
      category: DataTypes.STRING,
      icon: DataTypes.STRING,
      description: DataTypes.TEXT,
      priority: DataTypes.STRING,
      status: DataTypes.STRING,
      dudeDate: {
        type: DataTypes.DATE,
        field: "dudeDate",
      },
    },
    {
      sequelize,
      modelName: "Tasks",
    }
  );
  return Tasks;
};