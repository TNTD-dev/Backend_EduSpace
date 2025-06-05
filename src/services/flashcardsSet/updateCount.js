import { where } from "sequelize";
import db from "../../models/index";

const updateCount = async (setId) => {
  const set = await db.FlashcardSets.findOne({ where: { id: setId } });
  set.counts = set.counts + 1;
  const isUpdated = await set.save();
  if (isUpdated) {
    return "Counts updated";
  } else return "Counts not updated, something went wrong";
};

module.exports = updateCount;
