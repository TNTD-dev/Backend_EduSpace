const express = require("express");
const router = express.Router({ mergeParams: true });
const verifyToken = require("../middlewares/authMiddlewares");
const isMember = require("../middlewares/isMember");
const isTeacher = require("../middlewares/isTeacher");
const lessonControllers = require("../controllers/lessonControllers");
const upload = require("../configs/multerConfig");

// GET @protected routes
router.get("/", verifyToken, lessonControllers.getAllLessons); // Get all lessons
router.get("/:lessonId", verifyToken, lessonControllers.getSingleLesson); // Get single lessons

// POST @protected route
router.post(
  "/",
  verifyToken,
  isTeacher,
  upload.single('file'),
  lessonControllers.createNewLesson
); // create new lesson

// POST @protected route
router.post(
  "/:lessonId/mark-completed",
  verifyToken,
  isMember,
  lessonControllers.markAsCompleted
);

// PUT @protected route
router.put(
  "/:lessonId",
  verifyToken,
  isTeacher,
  upload.single('file'),
  lessonControllers.updateLesson
); // update lesson

// DELETE @protected route
router.delete(
  "/:lessonId",
  verifyToken,
  isTeacher,
  lessonControllers.deleteLesson
); // delete lesson

// PATCH @protected route
router.patch(
  "/:lessonId/order",
  verifyToken,
  isTeacher,
  lessonControllers.updateLessonOrder
); // update lesson order

module.exports = router;
