"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Replies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Replies.init(
    {
      discussionId: {
        type: DataTypes.BIGINT,
        field: "discussionId",
      },
      content: DataTypes.TEXT,
      authorId: {
        type: DataTypes.BIGINT,
        field: "authorId",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "createdAt",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updatedAt",
      },
    },
    {
      sequelize,
      modelName: "Replies",
    }
  );
  return Replies;
};
