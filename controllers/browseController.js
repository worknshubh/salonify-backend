const jsonwebtoken = require("jsonwebtoken");
const { JWT_KEY } = require("../keys");
const User = require("../models/user");
const SaloonOwner = require("../models/saloonowner");
const browseNearMe = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const userData = await User.findOne({
        _id: tokenData.id,
      });
      const userCity = userData.userLocation.userCity;
      const saloonData = await SaloonOwner.find({
        "saloonLocation.saloonCity": userCity,
      });
      if (saloonData === null) {
        return res.json({ msg: "No saloons in your city" });
      } else {
        return res.json({ saloonData });
      }
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized User" });
  }
};

module.exports = { browseNearMe };
