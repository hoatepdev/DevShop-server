const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (user)
      return res.status(400).json({ message: "Admin already registered" });

    User.estimatedDocumentCount(async (err, count) => {
      if (err) return res.status(400).json({ error });
      let role = "admin";
      if (count === 0) {
        role = "super-admin";
      }

      const { firstName, lastName, email, password } = req.body;
      const hash_password = await bcrypt.hash(password, 10);
      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: shortid.generate(),
        role,
      });

      _user.save((error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong",
          });
        }

        if (data) {
          return res.status(201).json({
            message: "Admin created Successfully..!",
          });
        }
      });
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!user) return res.status(400).json({ message: "Something went wrong" });
    const isPassword = await user.authenticate(req.body.password);

    if (!isPassword || user.role !== "admin")
      return res.status(400).json({ message: "Invalid password" });

   const token = generateJwtToken(user._id,user.role )

    const { _id, firstName, lastName, fullName, email, role } = user;
    res.cookie("token", token, { expriesIn: "1d" });
    
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

exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Signout successfully!" });
};
