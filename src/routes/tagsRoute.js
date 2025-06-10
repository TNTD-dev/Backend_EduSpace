const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const tagsController = require("../controllers/tagsController");

// GET @protected - get all tags
router.get("/", verifyToken, tagsController.getAll);

// GET @protected - get single tag
router.get("/:tagId", verifyToken, tagsController.getSingle);

// POST @protected - create new tag
router.post("/", verifyToken, tagsController.create);

// PUT @protected - update tag
router.put("/:tagId", verifyToken, tagsController.update);

// DELETE @protected - delete tag
router.delete("/:tagId", verifyToken, tagsController.delete);

module.exports = router;