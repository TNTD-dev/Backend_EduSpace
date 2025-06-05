const express = require("express");
const router = express.Router();
const setsController = require("../controllers/setsControllers");

// GET route
router.get("/singleSet", setsController.getSingleSet);

// PUT route
router.put("/updateSet", setsController.updateSet);

// POST route
router.post("/create", setsController.createNewSets);

router.get("/", setsController.getAllSets);

module.exports = router;
