const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
const JWT_KEY = process.env.JWT_KEY;
const User = require("../models/user");
const verifyRole = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const userData = await User.findOne({
        _id: tokenData.id,
      });

      if (userData) {
        return res.json({ msg: "User" });
      } else {
        return res.json({ msg: "SaloonOwner" });
      }
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized user" });
  }
};

module.exports = { verifyRole };
