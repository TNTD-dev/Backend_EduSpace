const express = require("express");
const router = express.Router();
const SiteControllers = require("../controllers/siteController");
const verifyToken = require("../middlewares/authMiddlewares");
const roleAuthenticate = require("../middlewares/roleMiddlewares");

router.get("/", (req, res) => {
  return res.render("home");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

router.get(
  "/student",
  verifyToken,
  roleAuthenticate(["student", "teacher", "admin"]),
  (req, res) => {
    return res.send("Student, teacher, admin can access this route");
  }
);

router.get(
  "/teacher",
  verifyToken,
  roleAuthenticate(["teacher", "admin"]),
  (req, res) => {
    return res.send("Only teacher and admin can access this route");
  }
);

router.get("/admin", verifyToken, roleAuthenticate(["admin"]), (req, res) => {
  return res.send("Only admin can access this route");
});

module.exports = router;
