"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CoursesEnrollments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      CoursesEnrollments.belongsTo(models.Users, {
        foreignKey: "studentId",
        as: "student",
      });

      CoursesEnrollments.belongsTo(models.Courses, {
        foreignKey: "courseId",
        as: "course",
      });
    }
  }
  CoursesEnrollments.init(
    {
      courseId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "courseId",
      },
      studentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "studentId",
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "enrollmentDate",
      },
      progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
      },
      grade: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      lastAccessed: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "lastAccessed",
      },
      completionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "completionDate",
      },
    },
    {
      sequelize,
      modelName: "CoursesEnrollments",
      tableName: "coursesenrollments"
    }
  );
  return CoursesEnrollments;
};
