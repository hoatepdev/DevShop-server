const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateJwtToken = (_id, role) => {
  jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (user)
      return res.status(400).json({ message: "User already registered" });

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: Math.random().toString(),
    });

    _user.save((err, user) => {
      if (err) return res.status(400).json({ message: err });
      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;

        return res.status(201).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) return res.status(400).json({ message: err });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.authenticate(req.body.password)) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    if (user.role !== "user")
      return res.status(400).json({ message: "Access denied" });

      const token = generateJwtToken(user._id, user.role);

    const { _id, firstName, lastName, fullName, email, role } = user;
    return res.json({
      token,
      user: {
        _id,
        firstName,
        lastName,
        email,
        role,
        fullName,
      },
    });
  });
};
