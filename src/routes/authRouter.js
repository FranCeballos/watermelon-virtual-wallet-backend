const express = require("express");
const { validateLogIn, validateSignUp } = require("../utils/validator");
const { postLogin, postSignup } = require("../controllers/auth");

const router = express.Router();

router.post("/login", validateLogIn, postLogin);
router.post("/signup", validateSignUp, postSignup);

module.exports = router;
