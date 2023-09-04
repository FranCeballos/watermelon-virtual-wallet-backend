const { body, check } = require("express-validator");
const User = require("../models/userModel.js");

exports.validateSignUp = [
  body("name", "Must be at least 3 characters.")
    .isString()
    .isLength({ min: 3 })
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject(
            "E-Mail registered, please pick a different one."
          );
        }
      });
    })
    .normalizeEmail(),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Must be at least 5 alphanumeric characters.")
    .isAlphanumeric()
    .withMessage("Must be alphanumeric.")
    .trim(),
  body("passwordConfirm")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match.");
      }
      return true;
    }),
];

exports.validateLogIn = [
  body("email")
    .isEmail()
    .withMessage("Enter a valid email address.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Must be at least 5 alphanumeric characters.")
    .isAlphanumeric()
    .withMessage("Must be alphanumeric.")
    .trim(),
];

exports.validateNewPassword = [
  body("password", "Password has to be valid.")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body("passwordConfirm")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match.");
      }
      return true;
    }),
];

exports.validateDeposit = [
  body("amount", "Enter amount")
    .isNumeric()
    .isLength({ max: 5 })
    .withMessage("Amount must be between 1 and 10.000"),
];

exports.validateSend = [
  body("email")
    .isEmail()
    .withMessage("Enter a valid email address.")
    .normalizeEmail(),
  body("amount", "Enter an amount.")
    .isNumeric()
    .isLength({ max: 5 })
    .withMessage("Amount must be between 1 and 10.000"),
];
