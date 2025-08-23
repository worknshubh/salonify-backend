const express = require("express");
const {
  signupSaloonOwner,
  signinSaloonOwner,
} = require("../controllers/saloonownerController");
const { signupUser, signinUser } = require("../controllers/usersController");
const { verifyRole } = require("../controllers/verificationController");
const { fetchInfo } = require("../controllers/infoContoller");
const router = express.Router();

router.post("/saloonowner/signup", signupSaloonOwner);
router.post("/saloonowner/signin", signinSaloonOwner);
router.post("/user/signup", signupUser);
router.post("/user/signin", signinUser);
router.get("/verifyrole", verifyRole);
router.get("/info", fetchInfo);
module.exports = router;
