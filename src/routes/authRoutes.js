const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const passport = require("passport");
const authMiddleware = require('../middlewares/authMiddlewares');
const db = require("../models/index");

// Login and Register routes
router.post("/login", authControllers.loginHandler);
router.post("/register", authControllers.registerController);
router.post("/forgotPassword", authControllers.forgotPassword);
router.put("/resetPassword", authControllers.resetPassword);
// Google authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  authControllers.googleRedirect
);
// Update role
router.post("/update-role", authMiddleware, authControllers.updateUserRole);

module.exports = router;
