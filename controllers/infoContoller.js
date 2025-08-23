const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const JWT_KEY = process.env.JWT_KEY;
const User = require("../models/user");
const SaloonOwner = require("../models/saloonowner");
const fetchInfo = async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const user = await User.findOne({
        _id: tokenData.id,
      });
      if (user) {
        return res.json({ data: user });
      } else {
        const salonowner = await SaloonOwner.findOne({
          _id: tokenData.id,
        });
        return res.json({ data: salonowner });
      }
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized user" });
  }
};

module.exports = { fetchInfo };
