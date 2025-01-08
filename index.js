// index.js
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const { constant } = require("./myConstants");
const path = require("path");
require("dotenv").config();
connectToMongo();
const app = express();
const port = constant.port;

app.use(cors());

app.use(express.json());
//  routes

app.get("/", (req, res) => {
  res.json({ status: 200, message: "Success" });
});

// Serve static files from the 'storage' directory
app.use("/storage", express.static(path.join(__dirname, "storage")));

// route for projects
app.use("/api/projects", require("./routes/projects"));

// route for authentication
app.use("/api/auth", require("./routes/users"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
