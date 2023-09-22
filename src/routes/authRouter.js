const express = require("express");
const { validateLogIn, validateSignUp } = require("../utils/validator");
const {
  getWakeup,
  postLogin,
  postSignup,
  postLogout,
} = require("../controllers/auth");

const router = express.Router();

router.get("/wakeup", getWakeup);
router.post("/login", validateLogIn, postLogin);
router.post("/signup", validateSignUp, postSignup);
router.post("/logout", postLogout);

module.exports = router;
