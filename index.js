// index.js
const connectToMongo = require("./db");
const express = require("express");

connectToMongo();
const app = express();
const port = 6000;

app.use(express.json());
//  routes

// route for projects
app.use("/api/projects", require("./routes/projects"));

// route for authentication
app.use("/api/auth", require("./routes/users"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
