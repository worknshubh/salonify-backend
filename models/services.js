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
      },
      serviceDesc: {
        type: String,
        required: true,
      },
      serviceCost: {
        type: Number,
        required: true,
      },
      serviceImage: {
        type: String,
      },
    },
  ],
  servicesBooked: [
    {
      bookedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      serviceTitle: {
        type: String,
      },
      serviceCost: {
        type: String,
      },
      scheduledDate: {
        type: String,
        required: true,
      },
      scheduledTime: {
        type: String,
        required: true,
      },
      serviceId: {
        type: mongoose.Schema.ObjectId,
        required: true,
      },
      transactionId: {
        type: String,
        // required: true,
      },
      phonePeTransactionId: {
        type: String,
        // required: false,
      },
      paymentStatus: {
        type: String,
        // required: true,
      },
    },
  ],
});

const Service = mongoose.model("service", services_schema);

module.exports = Service;
