const nodemailer = require("nodemailer");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID_EMAIL,
  process.env.GOOGLE_CLIENT_SECRET_EMAIL,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
});

const createTransporter = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID_EMAIL,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET_EMAIL,
        refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
  } catch (err) {
    console.log("Something went wrong with creating email transporter", err);
    throw err;
  }
};

module.exports = createTransporter;
