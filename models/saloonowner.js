const mongoose = require("mongoose");
const saloonowner_schema = new mongoose.Schema({
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
  userExperience: {
    type: Number,
    required: true,
  },
  saloonName: {
    type: String,
    required: true,
  },
  userNumber: {
    type: Number,
    required: true,
  },
  saloonLocation: {
    cityData: {
      saloonState: {
        type: String,
      },
      saloonCity: {
        type: String,
      },
    },
  },
});

const SaloonOwner = mongoose.model("Saloonowner", saloonowner_schema);

module.exports = SaloonOwner;
