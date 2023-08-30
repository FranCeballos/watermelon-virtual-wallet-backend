// Npm imports
const express = require("express");

// Controllers imports
const { postDeposit, getBalance, postSend } = require("../controllers/wallet");

//Validators imports
const { validateDeposit, validateSend } = require("../utils/validator");

const router = express.Router();

router.get("/balance", getBalance);

router.post("/deposit", validateDeposit, postDeposit);

router.post("/send", validateSend, postSend);

module.exports = router;
