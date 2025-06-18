const db = require("../models/index");
console.log("DB of users :", Object.keys(db));
const { errorResponse, successResponse } = require("../utils/responseHelper");
const { Op } = require("sequelize");

class UserControllers {
  getUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = await db.Users.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      if (!profile) {
        return errorResponse(res, "Could not find your profile", 404);
      }
      return successResponse(
        res,
        profile,
        "Successfully found your profile",
        200
      );
    } catch (err) {
      console.error("Error occurred in getUser: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  updateUser = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        city,
        dateOfBirth,
        gender,
      } = req.body;

      const userId = req.user.id;
      const user = await db.Users.findByPk(userId);
      if (!user) {
        return errorResponse(res, "Could not find user", 404);
      }

      // Validate email format if provided
      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return errorResponse(res, "Invalid email format", 400);
        }
        // Check if email is already taken by another user
        const existingUser = await db.Users.findOne({
          where: { email, id: { [Op.ne]: userId } },
        });
        if (existingUser) {
          return errorResponse(res, "Email is already taken", 400);
        }
      }

      // Validate phone format if provided
      if (phone !== undefined) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) {
          return errorResponse(res, "Invalid phone number format", 400);
        }
      }

      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (city !== undefined) updateData.city = city;
      if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
      if (gender !== undefined) updateData.gender = gender;

      await user.update(updateData);

      // Get updated user without password
      const updatedUser = await db.Users.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      return successResponse(
        res,
        updatedUser,
        "Successfully updated user",
        200
      );
    } catch (err) {
      console.error("Error occurred in updateUser: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await db.Users.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return errorResponse(res, "User not found", 404);
      }
      return successResponse(res, user, "Successfully found user", 200);
    } catch (err) {
      console.error("Error occurred in getUserById: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
}

module.exports = new UserControllers();