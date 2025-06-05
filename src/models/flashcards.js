"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FlashCards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FlashCards.init(
    {
      setId: DataTypes.BIGINT,
      frontText: DataTypes.TEXT,
      backText: DataTypes.TEXT,
      imgURL: DataTypes.TEXT,
      audioURL: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "FlashCards",
    }
  );
  return FlashCards;
};
