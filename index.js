// index.js
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo();
const app = express();
const port = 5173;

const corsOptions = {
  AccessControlAllowOrigin: "*",
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

app.use(express.json());
//  routes

// route for projects
app.use("/api/projects", require("./routes/projects"));

// route for authentication
app.use("/api/auth", require("./routes/users"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
