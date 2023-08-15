// Npm imports
const express = require("express");
const { getUser } = require("../controllers/wallet");

const router = express.Router();

router.get("/user", getUser);

module.exports = router;
