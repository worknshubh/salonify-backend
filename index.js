const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const authRoute = require("./routes/auth");
const serviceRoute = require("./routes/services");
const { MONGO_DB_URL, PORT } = require("./keys");
mongoose.connect(MONGO_DB_URL);
mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo DB");
  app.listen(PORT, "127.0.0.1", () => {
    console.log("Started on PORT ", PORT);
  });
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use("/auth", authRoute);
app.use("/services", serviceRoute);
