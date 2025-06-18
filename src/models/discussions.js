"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discussions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discussions.belongsTo(models.Users, { as: 'author', foreignKey: 'authorId' });
    }
  }
  Discussions.init(
    {
      courseId: {
        type: DataTypes.BIGINT,
        field: "courseId",
      },
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      authorId: {
        type: DataTypes.BIGINT,
        field: "authorId",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "createdAt",
      },
      lastActivity: {
        type: DataTypes.DATE,
        field: "lastActivity",
      },
      isPinned: {
        type: DataTypes.BOOLEAN,
        field: "isPinned",
      },
    },
    {
      sequelize,
      modelName: "Discussions",
      tableName: "discussions",
    }
  );
  return Discussions;
};




