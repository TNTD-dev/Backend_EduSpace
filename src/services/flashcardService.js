const { FlashcardDecks, FlashcardCards, FlashcardStudyLogs, User } = require("../models");
const { Op } = require("sequelize");

class FlashcardService {
  // Magic numbers for spaced repetition algorithm
  MIN_EASE_FACTOR = 1.3;
  HARD_INTERVAL_MULTIPLIER = 1.2;
  GOOD_INTERVAL_MULTIPLIER = 2.5;
  PERFECT_INTERVAL_MULTIPLIER = 3.5;
  HARD_EASE_FACTOR_DECREMENT = 0.1;
  FAILED_EASE_FACTOR_DECREMENT = 0.2;
  PERFECT_EASE_FACTOR_INCREMENT = 0.1;

  // Deck operations
  static async createDeck(userId, { name, description }) {
    return await FlashcardDecks.create({
      name,
      description,
      userId,
      cardCount: 0,
      dueCount: 0
    });
  }

  static async getUserDecks(userId) {
    try {
      console.log('Service: Getting decks for user:', userId);
      // Lấy tất cả deck của user
      const decks = await FlashcardDecks.findAll({
        where: { userId },
        order: [['updatedAt', 'DESC']]
      });

      // Lấy tất cả card của user (có studyLogs)
      const cards = await FlashcardCards.findAll({
        include: [
          {
            model: FlashcardDecks,
            as: 'deck',
            where: { userId },
            required: true
          },
          {
            model: FlashcardStudyLogs,
            as: 'studyLogs',
            required: false,
            order: [['createdAt', 'DESC']],
            limit: 1
          }
        ]
      });

      // Xác định status cho từng card giống getDueCards
      const now = new Date();
      const formattedCards = cards.map(card => {
        const latestLog = card.studyLogs?.[0];
        let status = 'new';
        let nextReview = null;
        if (latestLog) {
          nextReview = new Date(latestLog.nextReviewDate);
          if (nextReview <= now) {
            status = 'due';
          } else {
            status = 'learned';
          }
        }
        return {
          id: card.id,
          deckId: card.deckId,
          status
        };
      });

      // Group cards theo deckId
      const cardsByDeck = {};
      for (const card of formattedCards) {
        if (!cardsByDeck[card.deckId]) cardsByDeck[card.deckId] = [];
        cardsByDeck[card.deckId].push(card);
      }

      // Format lại decks, tính đúng dueCount
      const formattedDecks = decks.map(deck => {
        const deckCards = cardsByDeck[deck.id] || [];
        const dueCount = deckCards.filter(card => card.status === 'due' || card.status === 'new').length;
        return {
          ...deck.toJSON(),
          cardCount: deckCards.length,
          dueCount,
          lastStudied: deck.updatedAt ? new Date(deck.updatedAt).toLocaleDateString() : 'Never'
        };
      });

      console.log('Service: Formatted decks:', formattedDecks);
      return formattedDecks;
    } catch (error) {
      console.error('Service: Error in getUserDecks:', error);
      throw error;
    }
  }

  // Deck CRUD
  static async getDeckDetail(userId, deckId) {
    return await FlashcardDecks.findOne({ where: { id: deckId, userId } });
  }
  static async updateDeck(userId, deckId, data) {
    const deck = await FlashcardDecks.findOne({ where: { id: deckId, userId } });
    if (!deck) return null;
    await deck.update(data);
    return deck;
  }
  static async deleteDeck(userId, deckId) {
    const deck = await FlashcardDecks.findOne({ where: { id: deckId, userId } });
    if (!deck) return null;
    await deck.destroy();
    return true;
  }

  // Card operations
  static async createCard(userId, { deckId, question, answer, cardSetTitle }) {
    const deck = await FlashcardDecks.findOne({
      where: { id: deckId, userId }
    });

    if (!deck) {
      throw new Error("Deck not found");
    }

    const card = await FlashcardCards.create({
      deckId,
      question,
      answer,
      cardSetTitle,
      lastReviewed: new Date(),
      nextReview: new Date()
    });

    await deck.increment('cardCount');
    return card;
  }

  static async getDeckCards(userId, deckId) {
    try {
      console.log('Service: Getting cards for deck:', deckId, 'user:', userId);
      
      const deck = await FlashcardDecks.findOne({
        where: { id: deckId, userId }
      });

      if (!deck) {
        throw new Error("Deck not found");
      }

      const cards = await FlashcardCards.findAll({
        where: { deckId },
        include: [{
          model: FlashcardStudyLogs,
          as: 'studyLogs',
          where: { userId },
          required: false,
          order: [['createdAt', 'DESC']],
          limit: 1
        }],
        order: [['createdAt', 'DESC']]
      });

      console.log('Service: Found cards:', cards.length);

      // Format cards to include study status
      const formattedCards = cards.map(card => {
        const cardData = card.toJSON();
        const latestLog = cardData.studyLogs && cardData.studyLogs.length > 0 
          ? cardData.studyLogs[0] 
          : null;
        const now = new Date();
        let status = 'new';
        let nextReview = null;
        if (latestLog) {
          nextReview = new Date(latestLog.nextReviewDate);
          if (nextReview <= now) {
            status = 'due';
          } else {
            status = 'learned';
          }
        }
        return {
          ...cardData,
          status,
          interval: latestLog ? latestLog.interval || 0 : 0,
          easeFactor: latestLog ? latestLog.easeFactor || 2.5 : 2.5,
          repetitions: latestLog ? latestLog.stage || 0 : 0,
          lastReviewed: latestLog?.createdAt || null,
          nextReview: nextReview || null,
          studyLogs: undefined // Remove studyLogs from response
        };
      });

      console.log('Service: Formatted cards:', formattedCards.length);
      return formattedCards;
    } catch (error) {
      console.error('Service: Error in getDeckCards:', error);
      throw error;
    }
  }

  // Card CRUD
  static async getCardDetail(userId, cardId) {
    return await FlashcardCards.findOne({
      where: { id: cardId },
      include: [{
        model: FlashcardDecks,
        where: { userId },
        required: true
      }]
    });
  }
  static async updateCard(userId, cardId, data) {
    console.log('Service: Updating card:', { userId, cardId, data });
    const card = await FlashcardCards.findOne({
      where: { id: cardId },
      include: [{
        model: FlashcardDecks,
        as: 'deck',
        where: { userId },
        required: true
      }]
    });
    if (!card) return null;
    await card.update(data);
    return card;
  }
  static async deleteCard(userId, cardId) {
    const card = await FlashcardCards.findOne({
      where: { id: cardId },
      include: [{
        model: FlashcardDecks,
        as: 'deck',
        where: { userId },
        required: true
      }]
    });
    if (!card) return null;
    await card.destroy();
    return true;
  }

  // Study operations
  static async updateStudyLog(userId, cardId, status) {
    let [studyLog, created] = await FlashcardStudyLogs.findOrCreate({
      where: { cardId, userId },
      defaults: {
        cardId,
        userId,
        status,
        stage: 0,
        interval: 0,
        easeFactor: 2.5,
        nextReviewDate: new Date()
      }
    });

    let newStage = studyLog.stage;
    let newInterval = studyLog.interval;
    let newEaseFactor = studyLog.easeFactor;

    switch (status) {
      case 'failed':
        newStage = 0;
        newInterval = 0;
        newEaseFactor = Math.max(this.MIN_EASE_FACTOR, newEaseFactor - this.FAILED_EASE_FACTOR_DECREMENT);
        break;
      case 'hard':
        newStage = Math.max(1, newStage);
        newInterval = Math.max(1, Math.round(newInterval * this.HARD_INTERVAL_MULTIPLIER));
        newEaseFactor = Math.max(this.MIN_EASE_FACTOR, newEaseFactor - this.HARD_EASE_FACTOR_DECREMENT);
        break;
      case 'good':
        newStage = newStage + 1;
        newInterval = newInterval > 0 ? Math.round(newInterval * this.GOOD_INTERVAL_MULTIPLIER) : 1;
        // newEaseFactor giữ nguyên
        break;
      case 'perfect':
        newStage = newStage + 1;
        newInterval = newInterval > 0 ? Math.round(newInterval * this.PERFECT_INTERVAL_MULTIPLIER) : 2;
        newEaseFactor = newEaseFactor + this.PERFECT_EASE_FACTOR_INCREMENT;
        break;
      default:
        // fallback cho các giá trị cũ
        newStage = status === 'correct' ? newStage + 1 : 0;
        newInterval = this.calculateInterval(newStage, newInterval);
        newEaseFactor = this.calculateEaseFactor(newEaseFactor, status);
    }

    const nextReview = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);

    await studyLog.update({
      status,
      stage: newStage,
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReviewDate: nextReview
    });

    await FlashcardCards.update(
      { lastReviewed: new Date() },
      { where: { id: cardId } }
    );

    return studyLog;
  }

  // Get due cards for spaced repetition
  static async getDueCards(userId) {
    try {
      console.log('Fetching due cards for user:', userId);
      
      if (!userId) {
        throw new Error('User ID is required');
      }

      // First check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const cards = await FlashcardCards.findAll({
        where: {
          userId: userId
        },
        include: [
          {
            model: FlashcardStudyLogs,
            as: 'studyLogs',
            required: false,
            order: [['createdAt', 'DESC']],
            limit: 1
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      console.log('Raw cards found:', cards?.length || 0);

      if (!cards || cards.length === 0) {
        console.log('No cards found for user');
        return [];
      }

      const formattedCards = cards.map(card => {
        try {
          const latestLog = card.studyLogs?.[0];
          const now = new Date();
          
          // Calculate next review date
          let nextReview = null;
          if (latestLog) {
            nextReview = new Date(latestLog.nextReviewDate);
          }

          // Determine card status
          let status = 'new';
          if (latestLog) {
            if (nextReview <= now) {
              status = 'due';
            } else {
              status = 'learned';
            }
          }

          return {
            id: card.id,
            deckId: card.deckId,
            type: card.type,
            question: card.question,
            answer: card.answer,
            clozeText: card.clozeText,
            imageUrl: card.imageUrl,
            tags: card.tags || [],
            status,
            interval: latestLog?.interval || 0,
            easeFactor: latestLog?.easeFactor || 2.5,
            repetitions: latestLog?.repetitions || 0,
            lastReviewed: latestLog?.createdAt || null,
            nextReview: nextReview || null
          };
        } catch (cardError) {
          console.error('Error formatting card:', card.id, cardError);
          return null;
        }
      }).filter(card => card !== null);

      console.log('Formatted cards:', formattedCards?.length || 0);
      return formattedCards;
    } catch (error) {
      console.error('Error in getDueCards service:', error);
      throw new Error(error.message || 'Failed to fetch due cards');
    }
  }

  static async getDueCardsByDate(userId, date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const dueCards = await FlashcardCards.findAll({
      include: [{
        model: FlashcardStudyLogs,
        where: {
          userId,
          nextReviewDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        required: true
      }],
      order: [['lastReviewed', 'ASC']]
    });

    const cardsByDeck = {};
    for (const card of dueCards) {
      if (!cardsByDeck[card.deckId]) {
        cardsByDeck[card.deckId] = [];
      }
      cardsByDeck[card.deckId].push(card);
    }

    const deckIds = Object.keys(cardsByDeck);
    const decks = await FlashcardDecks.findAll({
      where: {
        id: {
          [Op.in]: deckIds
        }
      }
    });

    return decks.map(deck => ({
      deck: deck.toJSON(),
      cards: cardsByDeck[deck.id]
    }));
  }

  // Helper methods
  static calculateInterval(stage, currentInterval) {
    if (stage === 0) return 0;
    if (stage === 1) return 1;
    if (stage === 2) return 6;
    return Math.round(currentInterval * 2.5);
  }

  static calculateEaseFactor(currentEaseFactor, status) {
    const newEaseFactor = currentEaseFactor + (0.1 - (3 - status) * (0.08 + (3 - status) * 0.02));
    return Math.max(1.3, newEaseFactor);
  }

  // Đổi title cho tất cả card của user theo title cũ
  static async updateCardSetTitleForUser(userId, oldTitle, newTitle) {
    // Tìm tất cả card thuộc user và title cũ
    const cards = await FlashcardCards.findAll({
      include: [{
        model: FlashcardDecks,
        as: 'deck',
        where: { userId },
        required: true
      }],
      where: { cardSetTitle: oldTitle }
    });
    for (const card of cards) {
      await card.update({ cardSetTitle: newTitle });
    }
    return cards.length;
  }

  // Xóa tất cả card của user theo title
  static async deleteCardGroupByTitle(userId, title) {
    const cards = await FlashcardCards.findAll({
      include: [{
        model: FlashcardDecks,
        as: 'deck',
        where: { userId },
        required: true
      }],
      where: { cardSetTitle: title }
    });
    for (const card of cards) {
      await card.destroy();
    }
    return cards.length;
  }

  // Get flashcard statistics for dashboard
  static async getFlashcardStats(userId) {
    try {
      // Fetch all decks for the user
      const decks = await FlashcardDecks.findAll({
        where: { userId }
      });

      // Fetch cards for each deck
      const allCardsPromises = decks.map((deck) =>
        FlashcardCards.findAll({
          where: { deckId: deck.id }
        })
      );

      const cardsResponses = await Promise.all(allCardsPromises);
      const allCards = cardsResponses.flat();

      // Calculate total cards
      const totalCards = allCards.length;

      // Calculate due cards
      const dueCards = allCards.filter(
        (card) => card.status === "due" || card.status === "new"
      ).length;

      // Calculate learned cards
      const learnedCards = allCards.filter(
        (card) => card.status === "learned"
      ).length;

      // Calculate retention score
      const calculateRetentionScore = (cards) => {
        if (!cards || cards.length === 0) return 0;

        const weights = {
          learned: 1.0,
          due: 0.5,
          new: 0.2,
        };

        const totalWeight = cards.reduce(
          (sum, card) => sum + (weights[card.status] || 0),
          0
        );

        const maxPossibleWeight = cards.length * weights.learned;
        return Math.round((totalWeight / maxPossibleWeight) * 100) || 0;
      };

      const retentionScore = calculateRetentionScore(allCards);

      return {
        totalCards,
        dueCards,
        learnedCards,
        retentionScore
      };
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
      throw new Error('Failed to fetch flashcard statistics');
    }
  }
}

module.exports = FlashcardService;  