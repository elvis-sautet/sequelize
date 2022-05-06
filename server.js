const express = require("express");
const { sequelize } = require("./models");
const app = express();

// middleware
app.use(express.json());

// route
app.use("/user", require("./routes"));

// listen
app.listen(5000, async () => {
  console.log("server is running on port 3000");
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
