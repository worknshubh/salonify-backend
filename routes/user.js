const express = require("express");
const {
  bookService,
  updateProfile,
  myBookings,
} = require("../controllers/usersController");
const router = express.Router();

router.post("/bookservice/:id", bookService);
router.post("/updateprofile", updateProfile);
router.get("/mybookings", myBookings);
module.exports = router;
