import { where } from "sequelize";
import db from "../models/index";

const getFlashcards = async (setId) => {
  try {
    const data = await db.FlashCards.findAll({ where: { setId } });
    console.log(data);
    if (data) {
      return data;
    } else return null;
  } catch (err) {
    console.log("Error happened at /Services/getFlashcard");
    console.log(err);
    return null;
  }
};

module.exports = getFlashcards;
