const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_KEY } = require("../keys");
const Service = require("../models/services");

const signupUser = async (req, res) => {
  const { userName, userEmail, userPass, userNumber, userAddress, userCity } =
    req.body;
  try {
    const hashedPass = await bcrypt.hash(userPass, 10);
    await User.create({
      userName: userName,
      userEmail: userEmail,
      userPass: hashedPass,
      userNumber: userNumber,
      userAddress: userAddress,
      "userLocation.userCity": userCity,
    });

    return res.json({ msg: "User Created Successfully" });
  } catch (error) {
    return res.json({ msg: error });
  }
};

const signinUser = async (req, res) => {
  const { userEmail, userPass } = req.body;
  const userCheck = await User.findOne({
    userEmail: userEmail,
  });

  if (userCheck) {
    const userPasscheck = await bcrypt.compare(userPass, userCheck.userPass);
    if (userPasscheck === true) {
      const token = jsonwebtoken.sign({ id: userCheck._id }, JWT_KEY);
      return res.cookie("token", token).json({ msg: "Login Successful" });
    } else {
      return res.json({ msg: "Invalid Email or Password" });
    }
  } else {
    return res.json({ msg: "Invalid Email or Password" });
  }
};

const bookService = async (req, res) => {
  const id = req.params.id;
  const { scheduledDate, scheduledTime } = req.body;
  const token = req.cookies.token;

  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const bookingService = await Service.findOne({
        shopOwner: id,
      });
      bookingService.servicesBooked.push({
        bookedBy: tokenData.id,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
      });
      await bookingService.save();
      return res.json({ msg: "Service booked successfully" });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized User" });
  }
};

module.exports = { signupUser, signinUser, bookService };
