const express = require("express");
const {
  createService,
  deleteservice,
  editservice,
  fetchservices,
} = require("../controllers/servicesController");
const router = express.Router();

router.post("/addservice", createService);
router.get("/deleteservice/:id", deleteservice);
router.post("/editservice/:id", editservice);
router.get("/fetchservices", fetchservices);
module.exports = router;
