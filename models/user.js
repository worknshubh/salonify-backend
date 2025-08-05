const mongoose = require("mongoose");
const user_schema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  userPass: {
    type: String,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
  userNumber: {
    type: Number,
    required: true,
  },
  userLocation: {
    userState: {
      type: String,
    },
    userCity: {
      type: String,
    },
  },
});

const User = mongoose.model("User", user_schema);

module.exports = User;
