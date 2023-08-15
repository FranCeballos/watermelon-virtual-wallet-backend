// Core import
const { createServer } = require("http");

//Npm imports
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongodb-session")(session);

// Routes imports
const authRouter = require("./src/routes/authRouter");
const walletRouter = require("./src/routes/walletRouter");

// APP
const app = express();
const httpServer = createServer(app);
const store = new MongoStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// Session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//Middleware
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use("/app", walletRouter);
app.use("/auth", authRouter);

app.use((error, req, res, next) => {
  res.status(error.serverStatusCode).json({ error: "Internal server error" });
});

// Server StartUp
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URL)
  .then((result) => {
    httpServer.listen(PORT, () =>
      console.log(`MongoDb connected and Server started on Port: ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
