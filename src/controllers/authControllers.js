const db = require("../models/index");
console.log(
  "DB object state when authController is required:",
  Object.keys(db)
);
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { where } from "sequelize";
const crypto = require("crypto");
const hashedPasswordServices = require("../services/hashedPasswordService");

const createNewUser = require("../services/createNewUser");
const loginService = require("../services/loginService");
const { errorResponse, successResponse } = require("../utils/responseHelper");
const { generateResetToken } = require("../services/generatesResetToken");
const { sendResetPasswordEmail } = require("../utils/mailer");


class AuthControllers {
  // loginController = (req, res) => {
  //   return res.render("login");
  // };

  loginHandler = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data);
  };

  registerController = async (req, res) => {
    try {
      const { firstname, lastname, email, password } = req.body;
      
      // check if one value is empty
      if (!firstname || !lastname || !email || !password) {
        return errorResponse(res, "All fields are mandatory", 400);
      }

      // check existed email
      const existedUser = await db.Users.findOne({ where: { email } });
      if (existedUser) {
        return errorResponse(res, "Email has already existed", 400);
      }

      // create new user with null role
      const newUser = await createNewUser(
        firstname,
        lastname,
        email,
        password
      );

      // Generate temp token for role selection
      const tempToken = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          currentRole: newUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );

      // Return JSON response with redirect to role selection
      return successResponse(
        res,
        {
          token: tempToken,
          redirectUrl: `${process.env.FRONTEND_URL}/auth/select-role?token=${tempToken}`
        },
        "Registration successful. Please select your role.",
        200
      );

    } catch (err) {
      console.error("Error in registerController:", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      // Find User email in db
      const { email } = req.body;

      if (!email) {
        return errorResponse(res, "Missing values", 400);
      }

      const user = await db.Users.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        return errorResponse(res, "No user found", 404);
      }

      // Generate resetToken
      const token = await generateResetToken(user);
      console.log("Token: ", token);

      // Send reset email with the token

      await sendResetPasswordEmail(email, token);
      return successResponse(res, [], "We have sent a reset email", 200);
    } catch (err) {
      console.error("Error occured in forgotPassword: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { token, email } = req.query;
      const { newPassword } = req.body;
      if (!token || !email || !newPassword) {
        return errorResponse(res, "Missing values", 400);
      }

      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await db.Users.findOne({
        where: {
          email: email,
          resetToken: hashedToken,
          resetTokenExpired: { [where.gt]: new Date() },
        },
      });

      if (!user) {
        return errorResponse(res, "Invalid or expired token", 404);
      }

      const newHashedPassword = hashedPasswordServices(newPassword);
      await user.update({
        password: newHashedPassword,
        resetToken: null,
        resetTokenExpired: null,
      });

      return successResponse(res, user, "Successfully changes password", 200);
    } catch (err) {
      console.error("Error occured in resetPassword: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  googleRedirect = (req, res) => {
    try {
      const user = req.user;
      console.log("User object in googleRedirect:", user);
      console.log("User role:", user.role);
      console.log("User id:", user.id);

      // Kiểm tra xem user đã có role chưa
      if (user.role) {
        console.log("User has role, redirecting to success");
        const payload = {
          id: user.id,
          email: user.email,
          firstname: user.firstName,
          lastname: user.lastName,
          role: user.role,
        };

        console.log("Token payload: ", payload);
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRED_TIME,
        });

        console.log("Generated token: ", token);
        const redirectURL = `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`;
        console.log("Redirected URL: ", redirectURL);
        return res.redirect(redirectURL);
      }

      console.log("User has no role, redirecting to select-role");
      // Nếu là user mới (chưa có role), tạo tempToken và chuyển đến trang chọn role
      const tempToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          currentRole: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );

      // Redirect đến trang chọn role
      const selectRoleURL = `${process.env.FRONTEND_URL}/auth/select-role?token=${tempToken}`;
      console.log("Select role URL:", selectRoleURL);
      return res.redirect(selectRoleURL);
    } catch (err) {
      console.error("Error occurred in googleRedirect: ", err);
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google`);
    }
  };

  // Get user profile
  getProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await db.Users.findByPk(userId, {
        attributes: [
          'firstName', 
          'lastName', 
          'email', 
          'phone', 
          'dateOfBirth', 
          'city', 
          'gender', 
          'avatar',
          'role'
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : null,
        city: user.city || '',
        gender: user.gender || '',
        avatar: user.avatar || '',
        role: user.role || ''
      });
    } catch (error) {
      console.log("Error in getProfile: ", error);
      res.status(500).json({ error: error.message });
    }
  };

  // Update user profile
  updateProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { phone, dateOfBirth, city, gender, avatar } = req.body;

      const user = await db.Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update({
        phone,
        dateOfBirth,
        city,
        gender,
        avatar
      });

      res.json({ 
        message: 'Profile updated successfully',
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          city: user.city,
          gender: user.gender,
          avatar: user.avatar
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateUserRole = async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.user.id;

      // Validate role
      if (!role || !['student', 'teacher'].includes(role)) {
        return errorResponse(res, "Please select a valid role (student or teacher)", 400);
      }

      // Update user role in database
      const user = await db.Users.findByPk(userId);
      if (!user) {
        return errorResponse(res, "User not found", 404);
      }

      await user.update({ role });

      // Generate new token with updated role
      const payload = {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        role: role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRED_TIME,
      });

      // Return success response with redirect URL
      return successResponse(
        res,
        {
          redirectUrl: `${process.env.FRONTEND_URL}/${role}/dashboard`,
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: role,
          }
        },
        "Role updated successfully",
        200
      );

    } catch (err) {
      console.error("Error in updateUserRole:", err);
      return errorResponse(res, "Failed to update role", 500);
    }
  };
}

module.exports = new AuthControllers();


