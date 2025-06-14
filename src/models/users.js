"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User as a student enrolled in courses
      Users.belongsToMany(models.Courses, {
        through: models.CoursesEnrollments,
        foreignKey: "studentId",
        as: "enrolledCourses",
      });

      // User as an instructor of courses
      Users.hasMany(models.Courses, {
        foreignKey: "instructorId",
        as: "teachingCourses",
      });

      // User's discussions
      Users.hasMany(models.Discussions, {
        foreignKey: "authorId",
        as: "discussions",
      });

      // User's replies
      Users.hasMany(models.Replies, {
        foreignKey: "authorId",
        as: "replies",
      });

      // User's flashcard decks
      Users.hasMany(models.FlashcardDecks, {
        foreignKey: "userId",
        as: "flashcardDecks",
      });

      // User's assignments
      Users.hasMany(models.Assignments, {
        foreignKey: "authorId",
        as: "assignments",
      });

      // User's assignment feedbacks
      Users.hasMany(models.AssignmentFeedback, {
        foreignKey: "authorId",
        as: "givenFeedbacks",
      });

      // User's tags
      Users.hasMany(models.Tags, {
        foreignKey: "userId",
        as: "tags",
      });
    }
  }
  Users.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      googleId: DataTypes.STRING,
      facebookId: DataTypes.STRING,
      resetToken: DataTypes.STRING,
      resetTokenExpired: DataTypes.DATE,
      role: {
        type: DataTypes.ENUM("student", "teacher", "admin"),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '/icons8-user-96.png'
      }
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
