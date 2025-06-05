const express = require("express");
const router = express.Router();
const cardsControllers = require("../controllers/cardsControllers");

// GET routes
router.get("/", cardsControllers.getAllCardOfSet);
router.get("/:cardId", cardsControllers.getSingleCard);

// POST routes
router.post("/", cardsControllers.postNewFlashcardWithSetTitle);

// PUT routes
router.put("/:cardId", cardsControllers.updateFlashcard);

// DELETE routes
router.delete("/:cardId", cardsControllers.deleteFlashcard);
module.exports = router;
