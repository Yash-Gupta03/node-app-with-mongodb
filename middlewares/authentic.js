const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const id = jwt.verify(token, process.env.TOKEN);
    console.log("success");
    User.findById(id.userId)
      .then((user) => {
        req.user = user;
        console.log(req.user);
        next();
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};
