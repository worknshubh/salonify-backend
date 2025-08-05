const mongoose = require("mongoose");
const userreview_schema = new mongoose.Schema({
  saloonId: {
    type: mongoose.Schema.ObjectId,
    ref: "Saloonowner",
  },
  userReviews: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      userRating: {
        type: Number,
        required: true,
      },
      userComment: {
        type: String,
        required: true,
      },
    },
  ],
});

const UserReview = mongoose.model("Userreview", userreview_schema);

module.exports = UserReview;
