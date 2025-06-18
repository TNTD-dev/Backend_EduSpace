"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Assignments extends Model {
    static associate(models) {
      // Example association: Assignment belongs to Course
      Assignments.belongsTo(models.Modules, {
        foreignKey: "moduleId",
        as: "module",
        onDelete: "CASCADE",
      });

      Assignments.hasMany(models.AssignmentUpload, {
        foreignKey: "assignmentId",
        as: "uploads",
      });
    }
  }

  Assignments.init(
    {
      moduleId: {
        type: DataTypes.BIGINT,
        field: "moduleId",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        field: "dueDate",
      },
      status: {
        type: DataTypes.ENUM("to-do", "in-progress", "completed"),
        defaultValue: "to-do",
        allowNull: false,
      },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Assignments",
      tableName: "assignments",
      underscored: false, // if you want snake_case columns (created_at)
      timestamps: false
    }
  );

  return Assignments;
};
