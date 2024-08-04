// index.js
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const { constant } = require("./myConstants");
connectToMongo();
const app = express();
const port = constant.port;

const corsOptions = {
  AccessControlAllowOrigin: "*",
  origin: "http://localhost:5173",
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
