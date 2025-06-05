"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DiscussionTags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DiscussionTags.init(
    {
      discussionId: {
        type: DataTypes.BIGINT,
        field: "discussionId",
      },
      tag: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DiscussionTags",
    }
  );
  return DiscussionTags;
};
