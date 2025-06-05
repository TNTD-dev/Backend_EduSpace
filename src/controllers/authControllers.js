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
    console.log(req.body);
    const { firstname, lastname, email, password, role } = req.body;
    // check if one value is empty
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    // check existed email
    const existedUser = await db.Users.findOne({ where: { email } });
    if (existedUser) {
      return res.status(400).send("Email has already existed");
    } else {
      // create new user
      const newUser = await createNewUser(
        firstname,
        lastname,
        email,
        password,
        role
      );
      console.log("New user is: ", newUser);
      return res.status(200).json(newUser);
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
          resetTokenExpired: { [Op.gt]: new Date() },
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

  googleRedirect = async (req, res) => {
    try {
      // 1. Lấy thông tin user từ req.user (hoặc nơi bạn lưu user sau khi xác thực Google)
      const user = req.user; // hoặc lấy từ session, hoặc truy vấn DB
  
      // 2. Tạo JWT token cho user
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      // 3. Redirect về frontend kèm token và user (nên encode user là JSON)
      const frontendUrl = `http://localhost:5173/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
      return res.redirect(frontendUrl);
    } catch (err) {
      console.error('Google redirect error:', err);
      return res.redirect('http://localhost:5173/auth/login?error=google');
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
          'avatar'
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
        avatar: user.avatar || ''
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
}

module.exports = new AuthControllers();


