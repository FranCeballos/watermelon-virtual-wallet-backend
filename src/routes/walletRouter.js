// Npm imports
const express = require("express");
const {
  getUser,
  postDeposit,
  getBalance,
  postSend,
} = require("../controllers/wallet");

const router = express.Router();

router.get("/balance", getBalance);

router.post("/deposit", postDeposit);

router.post("/send", postSend);

module.exports = router;
