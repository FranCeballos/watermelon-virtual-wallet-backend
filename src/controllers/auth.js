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
    console.log(user);
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
  } catch (error) {}
};

exports.postLogin = (req, res, next) => {};
