const FlashcardService = require('../services/flashcardService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class FlashcardController {
  // Deck CRUD
  async createDeck(req, res) {
    try {
      const { name, description } = req.body;
      const userId = req.user.id;
      const deck = await FlashcardService.createDeck(userId, { name, description });
      return successResponse(res, deck, 'Deck created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getDecks(req, res) {
    try {
      const userId = req.user.id;
      console.log('Getting decks for user:', userId); // Debug log
      const decks = await FlashcardService.getUserDecks(userId);
      console.log('Decks found:', decks); // Debug log
      return successResponse(res, decks);
    } catch (error) {
      console.error('Error in getDecks:', error); // Error log
      return errorResponse(res, error.message || 'Failed to get decks', 500);
    }
  }

  async getDeckDetail(req, res) {
    try {
      const userId = req.user.id;
      const { deckId } = req.params;
      const deck = await FlashcardService.getDeckDetail(userId, deckId);
      if (!deck) return errorResponse(res, 'Deck not found', 404);
      return successResponse(res, deck);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async updateDeck(req, res) {
    try {
      const userId = req.user.id;
      const { deckId } = req.params;
      const data = req.body;
      const deck = await FlashcardService.updateDeck(userId, deckId, data);
      if (!deck) return errorResponse(res, 'Deck not found', 404);
      return successResponse(res, deck, 'Deck updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async deleteDeck(req, res) {
    try {
      const userId = req.user.id;
      const { deckId } = req.params;
      const result = await FlashcardService.deleteDeck(userId, deckId);
      if (!result) return errorResponse(res, 'Deck not found', 404);
      return successResponse(res, null, 'Deck deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Card CRUD
  async createCard(req, res) {
    try {
      const { deckId, question, answer, cardSetTitle } = req.body;
      const userId = req.user.id;
      const card = await FlashcardService.createCard(userId, { deckId, question, answer, cardSetTitle });
      return successResponse(res, card, 'Card created successfully', 201);
    } catch (error) {
      if (error.message === "Deck not found") {
        return errorResponse(res, error.message, 404);
      }
      return errorResponse(res, error.message, 500);
    }
  }

  async getCards(req, res) {
    try {
      const { deckId } = req.params;
      const userId = req.user.id;
      const cards = await FlashcardService.getDeckCards(userId, deckId);
      return successResponse(res, cards);
    } catch (error) {
      if (error.message === "Deck not found") {
        return errorResponse(res, error.message, 404);
      }
      return errorResponse(res, error.message, 500);
    }
  }

  async getCardDetail(req, res) {
    try {
      const userId = req.user.id;
      const { cardId } = req.params;
      const card = await FlashcardService.getCardDetail(userId, cardId);
      if (!card) return errorResponse(res, 'Card not found', 404);
      return successResponse(res, card);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async updateCard(req, res) {
    try {
      const userId = req.user.id;
      const { cardId } = req.params;
      const data = req.body;
      console.log('UpdateCard', { userId, cardId, data });
      const card = await FlashcardService.updateCard(userId, cardId, data);
      if (!card) return errorResponse(res, 'Card not found', 404);
      return successResponse(res, card, 'Card updated successfully');
    } catch (error) {
      console.error('Error in updateCard:', error);
      return errorResponse(res, error.message, 500);
    }
  }

  async deleteCard(req, res) {
    try {
      const userId = req.user.id;
      const { cardId } = req.params;
      const result = await FlashcardService.deleteCard(userId, cardId);
      if (!result) return errorResponse(res, 'Card not found', 404);
      return successResponse(res, null, 'Card deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Spaced repetition
  async updateStudyLog(req, res) {
    try {
      const { cardId } = req.params;
      const { status } = req.body;
      const userId = req.user.id;
      const studyLog = await FlashcardService.updateStudyLog(userId, cardId, status);
      return successResponse(res, studyLog, 'Study log updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getDueCards(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ 
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      console.log('Getting due cards for user:', req.user.id);
      const cards = await FlashcardService.getDueCards(req.user.id);
      console.log('Found due cards:', cards?.length || 0);

      return res.status(200).json({
        success: true,
        data: cards,
        message: 'Due cards retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getDueCards:', error);
      return res.status(500).json({ 
        success: false,
        message: error.message || 'Failed to get due cards',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  async getDueCardsByDate(req, res) {
    try {
      const userId = req.user.id;
      const { date } = req.params;
      const dueCards = await FlashcardService.getDueCardsByDate(userId, date);
      return successResponse(res, dueCards);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Đổi title nhóm card
  async updateCardGroupTitle(req, res) {
    try {
      const userId = req.user.id;
      const { oldTitle, newTitle } = req.body;
      const count = await FlashcardService.updateCardSetTitleForUser(userId, oldTitle, newTitle);
      return successResponse(res, { updated: count }, 'Group title updated');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Xóa nhóm card theo title
  async deleteCardGroupByTitle(req, res) {
    try {
      const userId = req.user.id;
      const { title } = req.params;
      const count = await FlashcardService.deleteCardGroupByTitle(userId, title);
      return successResponse(res, { deleted: count }, 'Group deleted');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Get flashcard statistics for dashboard
  async getFlashcardStats(req, res) {
    try {
      const userId = req.user.id; // Assuming user is authenticated and req.user is set

      const stats = await FlashcardService.getFlashcardStats(userId);
      return successResponse(res, stats);
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
      return errorResponse(res, 'Failed to fetch flashcard statistics', 500);
    }
  }
}

module.exports = new FlashcardController(); 