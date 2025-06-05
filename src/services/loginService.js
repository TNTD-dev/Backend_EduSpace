const { where } = require("sequelize");
const db = require("../models/index");
const comparePasswordService = require("../services/comparePassword");
import bcrypt from "bcryptjs";
require("dotenv").config();
const jwt = require("jsonwebtoken");

const loginService = async (email, password) => {
  try {
    // check all fields are filled yet
    if (!email || !password) {
      console.log("Missing username/password in login request.");
      return {
        errCode: 0,
        errMessage: "All fields are mandatory",
      };
    }

    const currentUser = await db.Users.findOne({ where: { email } });
    // check if there is a user with valid email
    if (currentUser) {
      const isMatchedPassword = await bcrypt.compare(
        password,
        currentUser.password
      );
      // check if the password is correct
      if (!isMatchedPassword) {
        console.log(
          "Login failed: User [input username] not found or password mismatch."
        );
        return {
          errCode: 2,
          errMessage: "Invalid password",
        };
      } else {
        // create an access token
        const payload = {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          role: currentUser.role,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRED_TIME,
        });
        return {
          accessToken,
          user: {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            role: currentUser.role,
          },
        };
      }
    } else {
      console.log(
        "Login failed: User [input username] not found or password mismatch."
      );
      return {
        errCode: 1,
        errMessage: "Invalid email",
      };
    }
  } catch (err) {
    console.log("Something went wrong", err);
    return null;
  }
};

module.exports = loginService;
