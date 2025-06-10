const authRoutes = require("./authRoutes");
const coursesEnrollmentRoutes = require("./coursesEnrollmentRoutes");
const siteRoutes = require("./siteRoutes");
const setsRoutes = require("./setsRoutes");
const cardsRoutes = require("./cardsRoutes");
const courseRoutes = require("./courseRoutes");
const coursesModulesRoutes = require("./coursesModulesRoutes");
const moduleLessonsRoutes = require("./moduleLessonsRoutes");
const moduleAssignmentRoutes = require("./moduleAssignmentRoutes");
const assignmentSubmission = require("./assignmentSubmissionRoutes");
const moduleResourcesRoutes = require("./moduleResourcesRoutes");
const calendarRoutes = require("./calendarRoutes");
const tagsRoute = require("./tagsRoute");
const userRoutes = require("./userRoutes");

const webRoutes = (app) => {
  app.use("/", siteRoutes);

  // Authentication management routes
  app.use("/auth", authRoutes);

  // User management routes
  app.use("/user", userRoutes);

  // Flashcard decks management route
  app.use("/api/sets", setsRoutes);

  // Flashcards management route
  app.use("/api/sets/:setId/cards", cardsRoutes);

  // Courses management route
  app.use("/api/courses", courseRoutes);

  // Course Enrollments route
  app.use("/api/coursesEnrollment", coursesEnrollmentRoutes);

  // Course - Module route
  app.use("/api/courses/:courseId/modules", coursesModulesRoutes);

  // Modules - Lessons route
  app.use(
    "/api/courses/:courseId/modules/:moduleId/lessons",
    moduleLessonsRoutes
  );

  // Module - Assignment route
  app.use(
    "/api/courses/:courseId/modules/:moduleId/assignments",
    moduleAssignmentRoutes
  );

  // Assignment - Submission
  app.use(
    "/api/course/:courseId/modules/:moduleId/assignments/:assignmentId/submissions",
    assignmentSubmission
  );

  // Module - Resources
  app.use(
    "/api/courses/:courseId/modules/:moduleId/resources",
    moduleResourcesRoutes
  );

  app.use("/api/calendar", calendarRoutes);

  app.use("/api/tags", tagsRoute);
};

export default webRoutes;
