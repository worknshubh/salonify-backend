const express = require("express");
const { bookService } = require("../controllers/usersController");
const router = express.Router();

router.post("/bookservice/:id", bookService);

module.exports = router;
