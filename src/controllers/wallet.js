//Npm imports
const jwt = require("jsonwebtoken");

// Model imports
const userModel = require("../models/userModel");

exports.getBalance = async (req, res, next) => {
  const token = req.headers["authorization"];
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

exports.postDeposit = (req, res, next) => {};

exports.postSend = (req, res, next) => {};
