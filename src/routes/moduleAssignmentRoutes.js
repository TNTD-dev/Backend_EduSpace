const express = require("express");
const router = express.Router({ mergeParams: true });
const verifyToken = require("../middlewares/authMiddlewares");
const isMember = require("../middlewares/isMember");
const isTeacher = require("../middlewares/isTeacher");
const ModuleAssignmentControllers = require("../controllers/moduleAssignmentControllers");
const moduleAssignmentControllers = require("../controllers/moduleAssignmentControllers");
const upload = require("../configs/multerConfig");

// GET @protected route
router.get(
  "/",
  verifyToken,
  isMember,
  ModuleAssignmentControllers.getAllAssignments
);

// GET @protected route
router.get(
  "/:assignmentId",
  verifyToken,
  isMember,
  ModuleAssignmentControllers.getAssignment
);

// POST @protected route
router.post(
  "/",
  verifyToken,
  isTeacher,
  upload.single("file"),
  moduleAssignmentControllers.createNewAssignment
);

// PUT @protected route
router.put(
  "/:assignmentId",
  verifyToken,
  isTeacher,
  moduleAssignmentControllers.updateAssignment
);

// DELTE @protected route
router.delete(
  "/:assignmentId",
  verifyToken,
  isTeacher,
  moduleAssignmentControllers.deleteAssignment
);

module.exports = router;
