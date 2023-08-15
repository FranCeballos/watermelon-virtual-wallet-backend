// Model imports
const userModel = require("../models/userModel");

exports.getUser = (req, res, next) => {
  const user = req.session.user;
  res.status(200).json(JSON.stringify({ name: "Francisco" }));
};
