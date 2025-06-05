import { where } from "sequelize";
import db from "../../models/index";

const createNewFlashcard = async (
  setId,
  frontText,
  backText,
  imgURL,
  audioURL
) => {
  try {
    const newFlashCard = await db.FlashCards.create({
      setId,
      frontText,
      backText,
      imgURL,
      audioURL,
    });

    if (!newFlashCard) {
      console.log("Cannot create new flashcard");
      return null;
    } else {
      console.log("Create new flashcard successfully");
      return newFlashCard;
    }
  } catch (err) {
    console.log(`Error happened at /services/flashCards/createNewFlashcard`);
    console.log(err);
    return null;
  }
};

module.exports = createNewFlashcard;
