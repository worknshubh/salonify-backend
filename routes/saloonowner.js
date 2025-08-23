const express = require("express");
const { updateprofile } = require("../controllers/saloonownerController");
const router = express.Router();

router.post("/updateprofile", updateprofile);

module.exports = router;
