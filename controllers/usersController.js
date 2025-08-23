const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");
const JWT_KEY = process.env.JWT_KEY;
const Service = require("../models/services");
const { v4: uuidv4 } = require("uuid");
const { paymentController } = require("./paymentController");
const signupUser = async (req, res) => {
  const {
    userName,
    userEmail,
    userPass,
    userNumber,
    userAddress,
    userCity,
    userState,
  } = req.body;
  try {
    if (userCity === null) {
      userCity = "Kolkata";
      userState = "West Bengal";
    }
    const hashedPass = await bcrypt.hash(userPass, 10);
    await User.create({
      userName: userName,
      userEmail: userEmail,
      userPass: hashedPass,
      userNumber: userNumber,
      userAddress: userAddress,
      "userLocation.userCity": userCity,
      "userLocation.userState": userState,
      userRole: "Customer",
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
      return res
        .cookie("token", token, {
          httpOnly: false,
          sameSite: "none",
          secure: false,
          path: "/",
          domain: undefined,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json({ msg: "Login Successful" });
    } else {
      return res.json({ msg: "Invalid Email or Password" });
    }
  } else {
    return res.json({ msg: "Invalid Email or Password" });
  }
};

const bookService = async (req, res) => {
  const id = req.params.id;
  const { scheduledDate, scheduledTime, serviceTitle, serviceCost } = req.body;
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const transactionId = uuidv4();
      const serviceDoc = await Service.findOne({ "servicesOffered._id": id });

      if (!serviceDoc) {
        return res.json({ msg: "Service not found" });
      }

      const selectedService = serviceDoc.servicesOffered.id(id);
      if (!selectedService) {
        return res.json({ msg: "Service option not found" });
      }
      console.log({
        bookedBy: tokenData.id,
        serviceId: selectedService._id,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        paymentStatus: "pending",
        transactionId: transactionId,
        serviceTitle: serviceTitle,
        serviceCost: serviceCost,
      });
      serviceDoc.servicesBooked.push({
        bookedBy: tokenData.id,
        serviceId: selectedService._id,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        paymentStatus: "pending",
        transactionId: transactionId,
        serviceTitle: serviceTitle,
        serviceCost: serviceCost,
      });

      await serviceDoc.save();

      return paymentController(req, res, transactionId);
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized user" });
  }
};

const updateProfile = async (req, res) => {
  const token = req.cookies.token;
  const { userName, userEmail, userNumber, userAddress, userImage } = req.body;
  if (token) {
    try {
      tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const UserData = await User.findOne({
        _id: tokenData.id,
      });

      UserData.userName = userName;
      UserData.userAddress = userAddress;
      UserData.userNumber = userNumber;
      UserData.userEmail = userEmail;
      if (userImage != "") {
        UserData.userImage = userImage;
      }

      await UserData.save();

      return res.json({ msg: "updated successfully" });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized User" });
  }
};

const myBookings = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const bookedbyUser = await Service.find({
        "servicesBooked.bookedBy": tokenData.id,
      }).sort({ createdAt: 1 });
      return res.json({ bookedbyUser });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized user" });
  }
};

module.exports = {
  signupUser,
  signinUser,
  bookService,
  updateProfile,
  myBookings,
};
