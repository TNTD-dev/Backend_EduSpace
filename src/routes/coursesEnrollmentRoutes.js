const express = require("express");
const router = express.Router();
const courseEnrollmentControllers = require("../controllers/courseEnrollmentControllers");
const isMember = require("../middlewares/isMember");
const verifyToken = require("../middlewares/authMiddlewares");
// ============================= COURSE MANAGEMENT =================================== //

router.get(
  "/:courseId/students",
  verifyToken,
  isMember,

  courseEnrollmentControllers.getStudentOfCourse
);
router.get(
  "/:studentId/courses",
  verifyToken,
  isMember,

  courseEnrollmentControllers.getCoursesOfStudent
);

// enroll by click on enroll button
router.post(
  "/:courseId/enrollCourse",
  verifyToken,
  courseEnrollmentControllers.enrollCourse
);

// Enroll through course code
router.post(
  "/enroll-by-code",
  verifyToken,
  courseEnrollmentControllers.enrollByCode
);

// Enroll course with invitation
router.post(
  "/:courseId/invite",
  verifyToken,
  courseEnrollmentControllers.enrollByInvitation
);

router.get(
  "/accept-invitation",
  verifyToken,
  courseEnrollmentControllers.acceptInvitation
);

// Delete Student
router.delete(
  "/:courseId/:studentId/delete-student",
  verifyToken,
  courseEnrollmentControllers.deleteStudent
);

router.get(
  "/my-courses",
  verifyToken,
  courseEnrollmentControllers.getMyCourses
);

module.exports = router;
