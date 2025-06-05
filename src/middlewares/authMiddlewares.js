const jwt = require("jsonwebtoken");
const db = require("../models/index");
const { where } = require("sequelize");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided or invalid format",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded); // kiểm tra có trường id không
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      }
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    // 3. Check token expiration
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    // 4. Get user from database
    const user = await db.Users.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 5. Check if user is active
    // if (!user.isActive) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "User account is deactivated",
    //   });
    // }

    // 6. Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // 7. Add token to request for potential use
    req.token = token;

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = verifyToken;
