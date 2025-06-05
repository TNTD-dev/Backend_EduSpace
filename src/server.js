const express = require("express");
const app = express();
const PORT = 4000;
import connectDB from "./configs/connectDB";
require("dotenv").config();
require("./configs/passport-google-setup.js");
const viewEngine = require("./configs/viewEngine.js");
const expressSession = require("express-session");
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";

import webRoutes from "./routes/index.js";

// Config
app.use(cors({
  origin: 'http://localhost:5173', // Đúng với địa chỉ frontend của bạn
  credentials: true, // Nếu bạn dùng cookie, còn nếu chỉ dùng token thì có thể bỏ
  allowedHeaders: ['Content-Type', 'Authorization'], // Cho phép header Authorization
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Session
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// View Engine
viewEngine(app);

// CONNECT DATABASE
connectDB();

// Routes
webRoutes(app);

// app.get("/", (req, res) => {
//   return res.send("Hello World");
// });
// START SERVER
const port = process.env.PORT || PORT;
app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});
