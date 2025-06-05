import db from "../models/index";
import { where } from "sequelize";

const createNewSet = require("../services/flashcardsSet/createNewSet");
class SetsController {
  // GET routes
  getAllSets = async (req, res) => {
    try {
      const data = await db.FlashcardSets.findAll();
      if (!data) {
        return res.status(400).json({ message: "there are no flashcard sets" });
      } else {
        return res.status(200).json(data);
      }
    } catch (err) {
      console.log("Could not get all the flashcard sets, error: ", err);
      return res.status(400).json({ message: "something went wrong" });
    }
  };

  getSingleSet = async (req, res) => {
    try {
      console.log("Query: ", req.query);
      console.log("Params: ", req.params);
      const requireTitle = req.query.title;
      const data = await db.FlashcardSets.findOne({
        where: { title: requireTitle },
      });

      if (!data) {
        console.log(`There is no flashcard set with ${req.query.title} title`);
        return res
          .status(400)
          .json({ message: "There is no available flashcard set" });
      } else {
        console.log(data);
        return res.status(200).json(data);
      }
    } catch (err) {
      console.log(`Could not get the ${req.params.title}, the error is: `, err);
      return res.status(400).json({ message: "something went wrong" });
    }
  };

  // POST route
  createNewSets = async (req, res) => {
    try {
      const { title, description, isPublic, counts } = req.body;
      const newSet = await createNewSet(title, description, isPublic, counts);
      if (newSet) {
        console.log("New flashcard sets created: ", newSet);
        return res
          .status(201)
          .json({ message: "create new flashcard sets successfully" });
      } else {
        return res
          .status(400)
          .json({ message: "Could not create new flashcard set" });
      }
    } catch (err) {
      console.log("Could not create a new set", err);
      return res.status(400).json({ message: "something went wrong" });
    }
  };

  // PUT route
  updateSet = async (req, res) => {
    const { title, description, isPublic } = req.body;
    const requireTitle = req.query.title;
    const flashcard = await db.FlashcardSets.findOne({
      where: { title: requireTitle },
    });
    if (flashcard) {
      flashcard.title = title;
      flashcard.description = description;
      flashcard.isPublic = isPublic;
      await flashcard.save();
      console.log("New flashcard: ", flashcard);
      return res.status(200).json({ message: "Update successfully" });
    } else {
      console.log("Cannot find flashcard set");
      return res.status(400).json({ message: "Could not find flashcard set" });
    }
  };
}

module.exports = new SetsController();
