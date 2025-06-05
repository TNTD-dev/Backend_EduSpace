"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FlashcardSets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FlashcardSets.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      userId: DataTypes.BIGINT,
      isPublic: DataTypes.BOOLEAN,
      counts: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FlashcardSets",
    }
  );
  return FlashcardSets;
};
