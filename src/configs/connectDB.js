const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("se104_real", "root", null, {
  host: "localhost",
  dialect: "mysql",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.log("Unable to connect to the database", error);
  }
};

module.exports = connectDB;
