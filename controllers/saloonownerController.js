const SaloonOwner = require("../models/saloonowner");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

const signupSaloonOwner = async (req, res) => {
  const {
    userName,
    userEmail,
    userPass,
    userNumber,
    userExperience,
    saloonName,
    userAddress,
    saloonCity,
    saloonState,
  } = req.body;
  try {
    const hashedPass = await bcrypt.hash(userPass, 10);
    if (saloonCity === null) {
      saloonCity = "Kolkata";
      saloonState = "West Bengal";
    }
    await SaloonOwner.create({
      userName: userName,
      userEmail: userEmail,
      userPass: hashedPass,
      userNumber: userNumber,
      userExperience: userExperience,
      userAddress: userAddress,
      saloonName: saloonName,
      "saloonLocation.saloonCity": saloonCity,
      "saloonLocation.saloonState": saloonState,
      userRole: "SaloonOwner",
    });

    return res.json({ msg: "User Created Successfully" });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const signinSaloonOwner = async (req, res) => {
  const { userEmail, userPass } = req.body;
  const userCheck = await SaloonOwner.findOne({
    userEmail: userEmail,
  });

  if (userCheck) {
    const userPasscheck = await bcrypt.compare(userPass, userCheck.userPass);
    if (userPasscheck === true) {
      const token = jsonwebtoken.sign({ id: userCheck._id }, JWT_KEY);
      res.cookie("token", token, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        msg: "Login Successful",
        token: token,
      });
    } else {
      return res.json({ msg: "Invalid Email or Password" });
    }
  } else {
    return res.json({ msg: "Invalid Email or Password" });
  }
};

const updateprofile = async (req, res) => {
  const token = req.cookies.token;
  const {
    userName,
    userAddress,
    userEmail,
    userExperience,
    saloonName,
    userNumber,
    userImage,
  } = req.body;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const saloonownerData = await SaloonOwner.findOne({
        _id: tokenData.id,
      });
      saloonownerData.userName = userName;
      saloonownerData.userEmail = userEmail;
      saloonownerData.userNumber = userNumber;
      saloonownerData.userAddress = userAddress;
      saloonownerData.userExperience = userExperience;
      saloonownerData.saloonName = saloonName;
      if (userImage != "") {
        saloonownerData.userImage = userImage;
      }

      await saloonownerData.save();
      return res.json({ msg: "Updated successfully" });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized User" });
  }
};
module.exports = { signupSaloonOwner, signinSaloonOwner, updateprofile };
