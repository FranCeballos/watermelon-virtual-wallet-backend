// Core import
const { createServer } = require("http");

//Npm imports
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");

// Routes imports
const walletRouter = require("./src/routes/walletRouter");

// APP
const app = express();
const httpServer = createServer(app);

//Middleware
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use("/app", walletRouter);

// Server StartUp
const PORT = process.env.PORT || 8081;
const server = httpServer.listen(PORT, () =>
  console.log(`Server started on Port: ${PORT}`)
);

server.on("error", (err) => console.log(err));
