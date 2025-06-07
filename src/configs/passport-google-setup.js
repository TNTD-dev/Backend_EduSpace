const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../models/index");
const { where } = require("sequelize");
require("dotenv").config();

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4003/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("you have came to callback function");
      console.log(profile);
      try {
        // check if the user exists - if not create a new one
        const currentUser = await db.Users.findOne({
          where: { googleId: profile.id },
        });

        if (currentUser) {
          console.log(`Current user is ${currentUser}`);
          done(null, currentUser);
        } else {
          const newUser = await db.Users.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: null // Explicitly set role as null for new users
          });
          console.log(`New user created ${newUser}`);
          done(null, newUser);
        }
      } catch (error) {
        console.error("Error in Google strategy:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.Users.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
