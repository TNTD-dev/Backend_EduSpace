const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const moduleControllers = require("../controllers/moduleControllers");
const isMember = require("../middlewares/isMember");
const lessonControllers = require("../controllers/lessonControllers");

// ---------------------------- Module Controllers ------------------------------------

// GET @protected routes
router.get("/", verifyToken, isMember, moduleControllers.getAllModules);
router.get("/:moduleId", verifyToken, isMember, moduleControllers.getModule);
router.get(
  "/:moduleId/progress",
  verifyToken,
  isMember,
  moduleControllers.getModuleProgress
);
// POST @protected route
router.post("/create-module", verifyToken, moduleControllers.createModule);

// PUT @protected route
router.put(
  "/:moduleId/update-module",
  verifyToken,
  moduleControllers.updateModule
);

// DELETE @protected route
router.delete(
  "/:moduleId/delete-module",
  verifyToken,
  moduleControllers.deleteModule
);

module.exports = router;
