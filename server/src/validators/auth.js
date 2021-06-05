const { check, validationResult } = require("express-validator");

exports.validateSignupRequest = [
  check("firstName").isEmpty().withMessage("firstName is required"),
  check("lastName").isEmpty().withMessage("lastName is required"),
  check("email").isEmail().withMessage("Email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
];

exports.validateSigninRequest = [
  check("email").isEmail().withMessage("Email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().lengh > 0)
    return res.status(400).json({ error: errors.array()[0].msg });

  next();
};
