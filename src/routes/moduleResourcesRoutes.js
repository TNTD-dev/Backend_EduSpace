const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const isMember = require("../middlewares/isMember");
const isTeacher = require("../middlewares/isTeacher");
const upload = require("../configs/multerConfig");
const moduleResourcesControllers = require("../controllers/moduleResourcesControllers");

// GET @protected - get all documentations of a module
router.get(
  "/",
  verifyToken,
  isMember,
  moduleResourcesControllers.getAllDocumentations
);

// GET @protected - get single documentation of a module
router.get(
  "/:documentationId",
  verifyToken,
  isMember,
  moduleResourcesControllers.getSingleDocumentation
);

// POST @protected - create or upload a documentation
router.post(
  "/",
  verifyToken,
  isMember,
  isTeacher,
  upload.single("file"),
  moduleResourcesControllers.createNewDocumentation
);

// PUT @protected - update a documentation
router.put(
  "/:documentationId",
  verifyToken,
  isMember,
  isTeacher,
  upload.single("file"),
  moduleResourcesControllers.updateDocumentation
);

// DELTE @protected - delete a documentation
router.delete(
  "/:documentationId",
  verifyToken,
  isMember,
  isTeacher,
  moduleResourcesControllers.deleteDocumentation
);

module.exports = router;
