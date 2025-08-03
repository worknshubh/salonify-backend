const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 4444;
const authRoute = require("./routes/auth");
const serviceRoute = require("./routes/services");
mongoose.connect(
  "mongodb+srv://shub117788:shubham123@cluster0.knld0hn.mongodb.net/salonify?retryWrites=true&w=majority&appName=Cluster0/"
);
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
