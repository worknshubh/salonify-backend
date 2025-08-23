const express = require("express");
const app = express();

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Use Railway's dynamic port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
