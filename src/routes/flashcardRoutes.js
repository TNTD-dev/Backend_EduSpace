const express = require('express');
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const flashcardController = require('../controllers/flashcardController');

router.use(verifyToken);

// Deck CRUD
router.post('/decks', flashcardController.createDeck);
router.get('/decks', flashcardController.getDecks);
router.get('/decks/:deckId', flashcardController.getDeckDetail);
router.put('/decks/:deckId', flashcardController.updateDeck);
router.delete('/decks/:deckId', flashcardController.deleteDeck);

// Group card title APIs
router.put('/cards/group-title', flashcardController.updateCardGroupTitle);
router.delete('/cards/group-title/:title', flashcardController.deleteCardGroupByTitle);
// Card CRUD
router.post('/cards', flashcardController.createCard);
router.get('/decks/:deckId/cards', flashcardController.getCards);
router.get('/cards/:cardId', flashcardController.getCardDetail);
router.put('/cards/:cardId', flashcardController.updateCard);
router.delete('/cards/:cardId', flashcardController.deleteCard);



// Study routes
router.get('/study/due', flashcardController.getDueCards);
router.get('/study/due/:date', flashcardController.getDueCardsByDate);
router.post('/study/:cardId', flashcardController.updateStudyLog);

// Get flashcard statistics for dashboard
router.get('/stats', flashcardController.getFlashcardStats);

module.exports = router; 