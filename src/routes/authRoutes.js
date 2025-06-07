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
// Profile routes
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await db.Users.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, dateOfBirth, gender } = req.body;
    
    const user = await db.Users.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      gender
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
