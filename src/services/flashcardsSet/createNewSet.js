import db from "../../models/index";

const createNewSet = async (Title, Description, Ispublic, Counts) => {
  if (!Title) {
    return res.status(400).json({ message: "Title should not be empty" });
  }

  try {
    const newSet = await db.FlashcardSets.create({
      title: Title,
      description: Description,
      isPublic: Ispublic,
      counts: Counts,
    });

    console.log("Create new flashcard sets successfully");
    return newSet;
  } catch (err) {
    console.log("Could not create new set", err);
  }
};

module.exports = createNewSet;
