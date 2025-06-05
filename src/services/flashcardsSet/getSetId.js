import { where } from "sequelize";
import db from "../../models/index";
import { get } from "../../routes/authRoutes";
// get set id with set title

const getSetId = async (setTitle) => {
  try {
    const data = await db.FlashcardSets.findOne({ where: { title: setTitle } });
    const setId = data.id;
    return setId;
  } catch (err) {
    console.log("Error happened at /Services/flashcardsSet/getSetId");
    console.log(err);
    return null;
  }
};

module.exports = getSetId;
