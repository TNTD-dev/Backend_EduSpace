"use strict";
const { Model } = require("sequelize");
const courseEnrollmentControllers = require("../controllers/courseEnrollmentControllers");
module.exports = (sequelize, DataTypes) => {
  class Courses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Courses.belongsToMany(models.Users, {
        through: models.CoursesEnrollments,
        foreignKey: "courseId",
        as: "students",
      });

      Courses.hasMany(models.Modules, {
        foreignKey: "courseId",
        as: "Course",
      });
    }
  }
  Courses.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryColor: {
        type: DataTypes.STRING,
        field: "categoryColor",
      },
      instructorId: {
        type: DataTypes.BIGINT,
        field: "instructorId",
        allowNull: true,
      },
      enrollCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "enrollCode",
      },
      image: DataTypes.TEXT,
      description: DataTypes.TEXT,
      startDate: {
        type: DataTypes.DATE,
        field: "startDate",
      },
      endDate: {
        type: DataTypes.DATE,
        field: "endDate",
      },
      schedule: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Courses",
    }
  );
  return Courses;
};
