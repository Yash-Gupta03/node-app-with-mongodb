const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    const id = jwt.verify(token, process.env.TOKEN);
    console.log(id.userId);
    console.log("success");
    User.findByPk(id.userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};
