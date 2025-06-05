const { raw } = require("body-parser");
const db = require("../models/index");
const crypto = require("crypto");

const generateResetToken = async function (user) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiredDate = new Date(Date.now() + 15 * 60 * 1000);
  await user.update({
    resetToken: hashedToken,
    resetTokenExpired: expiredDate,
  });

  console.log("Raw token: ", rawToken);

  return rawToken;
};

module.exports = { generateResetToken };
