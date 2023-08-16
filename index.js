// Core import
const { createServer } = require("http");

//Npm imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Routes imports
const authRouter = require("./src/routes/authRouter");
const walletRouter = require("./src/routes/walletRouter");

// APP
const app = express();
const httpServer = createServer(app);

//Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use("/app", walletRouter);
app.use("/auth", authRouter);

app.use((error, req, res, next) => {
  res.status(error.serverStatusCode).json({ error: error.message });
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
