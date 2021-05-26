const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {

  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user)
      return res.status(400).json({ message: "User already registered" });

    const { firstName, lastName, email, password } = req.body;

    const _user = new User({
      firstName,
      lastName,
      email,
      password,
      username: Math.random().toString(),
    });

    _user.save((err, data) => {
      if (err) return res.status(400).json({ message: err });
      return res.status(201).json({ user: data });
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
    if(user.role!=="user") return res.status(400).json({ message: "Access denied" });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
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