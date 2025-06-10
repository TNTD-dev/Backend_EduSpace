"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Tags belongs to a User
      Tags.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "user",
      });
      // Tags has many Calendars
      Tags.hasMany(models.Calendar, {
        foreignKey: "tagId",
        as: "calendars",
      });
    }
  }
  Tags.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bgColor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      textColor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      borderColor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Tags",
    }
  );
  return Tags;
};