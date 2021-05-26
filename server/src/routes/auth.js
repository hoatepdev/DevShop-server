const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { requireSignin } = require("../common-middleware");
const { signup, signin } = require("../controller/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validators/auth");

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);

router.post("/profile", requireSignin, (req, res) => {
  res.json({ user: "profile" });
});

module.exports = router;