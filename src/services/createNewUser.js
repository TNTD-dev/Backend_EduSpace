const db = require("../models/index");
const hashedPasswordService = require("./hashedPasswordService");

const createNewUser = async (firstname, lastname, email, password, role) => {
  try {
    const hashedPassword = hashedPasswordService(password);
    console.log("Hashed password: ", hashedPassword);
    let newUser = await db.Users.create({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: hashedPassword,
      role: role,
    });
    return newUser;
  } catch (err) {
    console.log("Could not create new user: ", err);
    return null;
  }
};

module.exports = createNewUser;
