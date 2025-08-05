const express = require("express");
const { browseNearMe } = require("../controllers/browseController");
const router = express.Router();

router.get("/", browseNearMe);

module.exports = router;
