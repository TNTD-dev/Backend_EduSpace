import db from "../models/index";
import { where } from "sequelize";

import { get } from "../routes/authRoutes";
import { errorResponse, successResponse } from "../utils/responseHelper";
import { canTreatArrayAsAnd } from "sequelize/lib/utils";
const getSetId = require("../services/flashcardsSet/getSetId");
const getFlashcard = require("../services/getFlashcard");
const createNewFlashcard = require("../services/flashCards/createNewFlashcard");
const updateCount = require("../services/flashcardsSet/updateCount");

class cardsControllers {
  // get all the flashcard with set id
  getAllCardOfSet = async (req, res) => {
    try {
      const setId = req.params.setId;
      const data = await db.FlashcardSets.findOne({ where: { id: setId } });
      const setTitle = data.title;
      if (!setTitle) {
        console.log(`Do not have set with title ${setTitle}`);
        return res
          .status(400)
          .json({ message: `Set with title ${setTitle} is not available` });
      } else {
        console.log(setId);
        const flashCard = await getFlashcard(setId);
        console.log(flashCard);
        if (!flashCard) {
          console.log(`Could not get flashcard, the flashcard is null`);
          return res.status(400).json({ message: `Something went wrong` });
        } else {
          console.log("Get all the flashcards with require setId successfully");
          return res.status(200).json(flashCard);
        }
      }
    } catch (err) {
      console.log(`Bug happened at /controllers/cardsControllers`);
      console.log(err);
      return res.status(400).json({ message: "Something went wrong" });
    }
  };

  getSingleCard = async (req, res) => {
    try {
      const { cardId, setId } = req.params;
      if (!cardId || !setId) {
        return errorResponse(res, "Missing values", 400);
      }

      const card = await db.FlashCards.findOne({
        where: {
          id: cardId,
          setId: setId,
        },
      });

      if (!card) {
        return errorResponse(res, "Could not find flashcard", 404);
      }

      return successResponse(res, card, "Found flashcard successfully");
    } catch (err) {
      console.error("Error occured in getSingleCard: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  // Create new flashcard when having setTitle
  postNewFlashcardWithSetTitle = async (req, res) => {
    try {
      const setId = req.params.setId;

      const { frontText, backText, imgURL, audioURL } = req.body;
      const newFlashCard = await createNewFlashcard(
        setId,
        frontText,
        backText,
        imgURL,
        audioURL
      );
      if (!newFlashCard) {
        return res.status(400).json({ message: "Cannot create new flashcard" });
      } else {
        const updateCountMessage = await updateCount(setId);
        console.log(updateCountMessage);
        console.log(newFlashCard);
        return res
          .status(200)
          .json({ message: "Create new flashcard successfully" });
      }
    } catch (err) {
      console.log("Something went wrong at /controllers/cardsController", err);
      return res.status(400).json({ message: "something went wrong" });
    }
  };

  updateFlashcard = async (req, res) => {
    const { setId, cardId } = req.params;
    const { frontText, backText } = req.body;

    try {
      const flashCard = await db.FlashCards.findOne({
        where: { id: cardId, setId: setId },
      });
      if (!flashCard) {
        console.log("Could not find flashcard to update");
        return res.status(400).json({ message: "something went wrong" });
      } else {
        flashCard.frontText = frontText;
        flashCard.backText = backText;
        await flashCard.save();
        console.log("Successfully updated flashcard: ", flashCard);
        return res.status(200).json({ message: "Updated successfully" });
      }
    } catch (err) {
      console.log("Error happened at /cardControllers/updateFlashcard");
      return res.status(400).json({ message: "something went wrong" });
    }
  };

  deleteFlashcard = async (req, res) => {
    const { setId, cardId } = req.params;
    try {
      await db.FlashCards.destroy({ where: { id: cardId, setId: setId } });
      console.log("Delete flashcard successfully");
      return res.status(200).json({ message: "Card deleted" });
    } catch (err) {
      console.log("Something happened when deleting: ", err);
      return res.status(400).json({ message: "Something went wrong" });
    }
  };
}

module.exports = new cardsControllers();
