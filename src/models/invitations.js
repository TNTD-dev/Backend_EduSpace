"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invitations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invitations.init(
    {
      courseId: DataTypes.BIGINT,
      email: DataTypes.STRING,
      token: DataTypes.STRING,
      status: DataTypes.STRING,
      expiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Invitations",
    }
  );
  return Invitations;
};
