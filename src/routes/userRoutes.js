const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const isTeacher = require("../middlewares/isTeacher");
const isMember = require("../middlewares/isMember");
const userControllers = require("../controllers/userControllers");

router.get("/", verifyToken, userControllers.getUser);
router.put("/profile", verifyToken, userControllers.updateUser);

module.exports = router;