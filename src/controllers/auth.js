// Core imports
const crypto = require("crypto");
// Npm imports
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// Model imports
const User = require("../models/userModel.js");

//Utils imports
const { next500error } = require("../utils/next500error.js");

exports.postSignup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .json({ error: "Email already registered. Use other email." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      balance: 0,
      movements: [],
    });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User created", user: { name, email } });
  } catch (error) {
    next500error(next, error);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "Email not registered." });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).json({ error: "Invalid email and/or password" });
    }

    req.session.user = user;
    req.session.isLoggedIn = true;
    req.session.save((err) => console.log(err));
    return res.status(200).json({
      message: "Successfully logged in.",
      session: { user: req.session.user },
      isLoggedIn: req.session.isLoggedIn,
    });
  } catch (error) {
    next500error(next, error);
  }
};

exports.postLogout = (req, res, next) => {
  if (req.session.user) {
    const userEmail = req.session.user.email;
    req.session.destroy();
    return res
      .status(200)
      .json({ message: "Successfully Logged Out", user: userEmail });
  }
  return res
    .status(401)
    .json({ error: "Can't log out when you aren't logged in." });
};
