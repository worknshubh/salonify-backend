const mongoose = require("mongoose");
const services_schema = new mongoose.Schema({
  shopOwner: {
    type: mongoose.Schema.ObjectId,
    ref: "SaloonOwner",
  },
  servicesOffered: [
    {
      serviceTitle: {
        type: String,
        required: true,
        unique: true,
      },
      serviceDesc: {
        type: String,
        required: true,
      },
      serviceCost: {
        type: Number,
        required: true,
      },
    },
  ],
  servicesBooked: [
    {
      bookedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      scheduledDate: {
        type: Date,
        required: true,
      },
      scheduledTime: {
        type: String,
        required: true,
      },
    },
  ],
});

const Service = mongoose.model("service", services_schema);

module.exports = Service;
