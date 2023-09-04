//Npm imports
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Model imports
const userModel = require("../models/userModel");
const transactionModel = require("../models/transactionModel");

exports.getBalance = async (req, res, next) => {
  // Get token
  const token = req.headers["authorization"].split(" ")[1];
  try {
    //Verify token
    const isValid = await jwt.verify(token, process.env.TOKEN_KEY);

    // Search user
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
  // Get token
  const token = req.headers["authorization"].split(" ")[1];
  const amountToAdd = parseFloat(req.body.amount);

  try {
    // Verify token
    const tokenIsValid = await jwt.verify(token, process.env.TOKEN_KEY);

    // Input validation
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errorObj = {};
      validationErrors.array().forEach((i) => (errorObj[i.path] = i.msg));
      return res.status(422).json(errorObj);
    }

    // Search user
    const user = await userModel.findById(tokenIsValid.userId);

    if (!user) {
      const error = new Error("No user found. Invalid User ID.");
      error.status = 404;
      throw error;
    }

    // Add to balance
    user.balance += parseFloat(amountToAdd);
    user.movements.unshift({
      amount: amountToAdd,
      description: "Deposit",
      sender: "You",
      date: Date.now(),
    });
    const newUser = await user.save();

    // Add transaction to database
    const userId = user._id;
    const transaction = await transactionModel.insertMany({
      amount: amountToAdd,
      sender: userId,
      receiver: userId,
      date: Date.now(),
    });

    return res.status(200).json({ transaction });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.postSend = async (req, res, next) => {
  // Get body and token
  const { email, amount } = req.body;
  const parsedAmount = parseFloat(amount);
  const token = req.headers["authorization"].split(" ")[1];
  try {
    // Verify token
    const tokenIsValid = await jwt.verify(token, process.env.TOKEN_KEY);

    // Input validation
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errorObj = {};
      validationErrors.array().forEach((i) => (errorObj[i.path] = i.msg));
      return res.status(422).json(errorObj);
    }

    // Search sender user
    const userSender = await userModel.findById(tokenIsValid.userId);

    if (!userSender) {
      return res.status(404).json({ email: "Sender user not found." });
    }

    // Check if has enough balance
    if (userSender.balance < parsedAmount) {
      return res.status(401).json({ amount: "Not enough balance." });
    }

    // Search receiver user
    const userReceiver = await userModel.findOne({ email });

    if (!userReceiver) {
      return res
        .status(404)
        .json({ email: "No user found.", searchedEmail: email });
    }
    if (userReceiver.email === userSender.email) {
      return res.status(401).json({ email: "Can't send to your self." });
    }

    // Transaction
    userSender.balance -= parsedAmount;
    userReceiver.balance += parsedAmount;

    userSender.movements.unshift({
      amount: parsedAmount,
      description: "Sent",
      sender: userReceiver.name,
      date: Date.now(),
    });
    userReceiver.movements.unshift({
      amount: parsedAmount,
      description: "Deposit",
      sender: userSender.name,
      date: Date.now(),
    });
    await userSender.save();
    await userReceiver.save();

    // Add transaction to database
    const transaction = await transactionModel.insertMany({
      amount: parsedAmount,
      sender: userSender._id,
      receiver: userReceiver._id,
      date: Date.now(),
    });

    return res.status(200).json({ transactionId: transaction });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
