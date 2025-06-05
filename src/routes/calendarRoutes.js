const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const calendarController = require("../controllers/calendarController");

router.get("/", verifyToken, calendarController.getAll);
router.get("/:eventId", verifyToken, calendarController.getSingle);
router.post("/", verifyToken, calendarController.createNew);
router.put("/:eventId", verifyToken, calendarController.update);
router.delete("/:eventId", verifyToken, calendarController.delete);

module.exports = router;
