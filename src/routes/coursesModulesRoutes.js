const express = require("express");
const router = express.Router({ mergeParams: true });
const verifyToken = require("../middlewares/authMiddlewares");
const moduleControllers = require("../controllers/moduleControllers");
const isMember = require("../middlewares/isMember");
const lessonControllers = require("../controllers/lessonControllers");

// Lấy tất cả modules của 1 course
router.get("/", verifyToken, isMember, moduleControllers.getAllModules);

// Lấy 1 module cụ thể
router.get("/:moduleId", verifyToken, isMember, moduleControllers.getModule);

// Lấy progress của 1 module
router.get(
  "/:moduleId/progress",
  verifyToken,
  isMember,
  moduleControllers.getModuleProgress
);

// Tạo module mới
router.post("/", verifyToken, moduleControllers.createModule);

// Cập nhật module
router.put("/:moduleId", verifyToken, moduleControllers.updateModule);

// Cập nhật thứ tự module
router.patch("/:moduleId/order", verifyToken, moduleControllers.updateModuleOrder);

// Xóa module
router.delete("/:moduleId", verifyToken, moduleControllers.deleteModule);

module.exports = router;
