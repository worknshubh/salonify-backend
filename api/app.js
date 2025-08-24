const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();

const authRoute = require("../routes/auth");
const serviceRoute = require("../routes/services");
const userRoute = require("../routes/user");
const browseRoute = require("../routes/browse");
const saloonownerRoute = require("../routes/saloonowner");
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const PORT = process.env.PORT;
const MERCHANT_ID = process.env.MERCHANT_ID;
const MERCHANT_STATUS_URL = process.env.MERCHANT_STATUS_URL;
const PAYMENT_SALT_KEY = process.env.PAYMENT_SALT_KEY;
const crypto = require("crypto");
const Service = require("../models/services");
mongoose.connect(MONGO_DB_URL);
mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo DB");
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use("/api/auth", authRoute);
app.use("/api/services", serviceRoute);
app.use("/api/user", userRoute);
app.use("/api/browse", browseRoute);
app.use("/api/salonowner", saloonownerRoute);

app.get("/api/payment/status/:txnId", async (req, res) => {
  const { txnId } = req.params;
  try {
    const sha256 = crypto
      .createHash("sha256")
      .update(`/pg/v1/status/${MERCHANT_ID}/${txnId}` + PAYMENT_SALT_KEY)
      .digest("hex");
    const checksum = sha256 + "###1";

    const response = await fetch(
      `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${txnId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": MERCHANT_ID,
        },
      }
    );

    const data = await response.json();
    const phonePeStatus = data?.data?.state;

    if (phonePeStatus) {
      await Service.updateOne(
        { "servicesBooked.transactionId": txnId },
        {
          $set: {
            "servicesBooked.$.paymentStatus": phonePeStatus.toLowerCase(),
          },
        }
      );
    }

    res.json({
      success: true,
      status: phonePeStatus || "UNKNOWN",
      txnId,
    });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
});

module.exports = app;
