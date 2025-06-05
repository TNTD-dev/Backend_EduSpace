const db = require("../models/index");
import bcrypt from "bcryptjs";
const comparePasswordService = async (password, dbPassword) => {
  try {
    const isMatched = await bcrypt.compare(password, dbPassword);
    return isMatched;
  } catch (err) {
    console.log("Error happened in compare password: ", err);
    return false;
  }
};

module.exports = comparePasswordService;
