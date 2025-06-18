const express = require("express");
const router = express.Router();
const coursesControllers = require("../controllers/coursesControllers");
const verifyToken = require("../middlewares/authMiddlewares");
const isMember = require("../middlewares/isMember");

// ============================= COURSE MANAGEMENT =================================== //

// GET @protected route
router.get("/", coursesControllers.getAllCourses);
router.get("/:courseId", coursesControllers.getSingleCourse);
// POST @protected route
router.post(
  "/createNewCourse",
  verifyToken,
  coursesControllers.createNewCourse
);
// PUT @protected route
router.put(
  "/:courseId/updateCourse",
  verifyToken,
  coursesControllers.updateCourse
);
// DELETE @protected route
router.delete(
  "/:courseId/deleteCourse",
  verifyToken,
  coursesControllers.deleteCourse
);

router.get(
  "/:courseId/progress",
  verifyToken,
  isMember,
  coursesControllers.getCourseProgress
);

module.exports = router;
