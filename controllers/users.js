const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isStringInvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

function generateToken(id, ispremiumuser) {
  return jwt.sign({ userId: id, ispremiumuser }, process.env.TOKEN);
}

// Controller for Sign up
exports.signUp = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (
      isStringInvalid(name) ||
      isStringInvalid(email) ||
      isStringInvalid(password)
    ) {
      res.status(400).json({ message: "bad parameters" });
    }
    const check = await User.findAll({where:{email:email}});
    if(check.length > 0){
      res.status(200).json({ success: false, message: "Email already exists, try again" });
    }else{
    bcrypt.hash(password, 10, async (err, hash) => {
      // console.log(err);
      const data = await User.create({
        name: name,
        email: email,
        password: hash,
        ispremiumuser: false,
        totalExpense: 0
      }).catch((err=>console.log(err)))
      res.status(201).json({success:true, message:'new user created'});
    });
  }} catch (err) {
    res.status(500).json({ message: err });
  }
};

// Controller for Login
exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (isStringInvalid(email) || isStringInvalid(password)) {
      res.status(400).json({ message: "bad parameters" });
    }

    const data = await User.findAll({
      where: { email: email },
    });
    if (data.length > 0) {
      bcrypt.compare(password, data[0].password, (error, result) => {
        if (error) {
          res.status(500).json({ message: "something wrong happened" });
        } else if (result == true) {
          res.status(200).json({
            success: true,
            message: "logged in successfully",
            token: generateToken(data[0].id, data[0].ispremiumuser),
          });
        } else {
          res.status(201).json({ success: false, message: "Wrong Password" });
        }
      });
    } else {
      res.status(201).json({ success: false, message: "User does not exist, try again" });
    }
  } catch (err) {
    res.status(500).json({ err: err });
  }
};


