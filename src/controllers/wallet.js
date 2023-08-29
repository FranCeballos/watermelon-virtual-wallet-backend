//Npm imports
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Model imports
const userModel = require("../models/userModel");

exports.getBalance = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  try {
    const isValid = await jwt.verify(token, process.env.TOKEN_KEY);

    const user = await userModel.findById(isValid.userId);

    if (!user) {
      const error = new Error("No user found. Invalid User ID.");
      error.status = 404;
      throw error;
    }

    return res
      .status(200)
      .json({ balance: user.balance, movements: user.movements });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.postDeposit = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  const amountToAdd = parseFloat(req.body.amount);

  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ error: validationErrors.array()[0].msg });
  }

  try {
    const isValid = await jwt.verify(token, process.env.TOKEN_KEY);

    const user = await userModel.findById(isValid.userId);

    if (!user) {
      const error = new Error("No user found. Invalid User ID.");
      error.status = 404;
      throw error;
    }

    user.balance += parseFloat(amountToAdd);
    user.movements.unshift({
      amount: amountToAdd,
      description: "Deposit",
      sender: "You",
      date: Date.now(),
    });
    const newUser = await user.save();

    return res
      .status(200)
      .json({ balance: newUser.balance, movements: newUser.movements });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.postSend = (req, res, next) => {};
