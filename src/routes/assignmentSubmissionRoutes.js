const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const isTeacher = require("../middlewares/isTeacher");
const isMember = require("../middlewares/isMember");
const assignmentSubmissionControllers = require("../controllers/assignmentSubmissionControllers");
const upload = require("../configs/multerConfig");

// GET @protected route - instructor get all submissions
router.get(
  "/",
  verifyToken,
  isTeacher,
  assignmentSubmissionControllers.getStudentSubmissions
);

// GET @protected route - instructor see submission of a particular student
router.get(
  "/:studentId",
  verifyToken,
  isTeacher,
  assignmentSubmissionControllers.getSingleStudentSubmission
);

// GET @protected route - student get single submission
router.get(
  "/me",
  verifyToken,
  isMember,
  assignmentSubmissionControllers.getSubmission
);

// POST @protected route - students submit their assignment
router.post(
  "/submit",
  verifyToken,
  isMember,
  upload.single("file"),
  assignmentSubmissionControllers.submitAssignment
);

// PUT @protected route - instructor grade submission
router.put(
  "/:studentId/grade",
  verifyToken,
  isTeacher,
  assignmentSubmissionControllers.gradeStudent
);

// PUT @protected route - students change their submission
router.put(
  "/:submissionId",
  verifyToken,
  isMember,
  upload.single("file"),
  assignmentSubmissionControllers.changeSubmission
);

module.exports = router;
