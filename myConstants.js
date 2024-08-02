const jwt = require("jsonwebtoken");

// basic constant
const constant = {
  mongoUrl: "mongodb://localhost:27017/Portfolio",
  JWT_SECRET: "iLoveHer",
};

// expiry time for authentication token, must use s or h after the number otherwise it will consider it as a ms
const expiryTime = "1200s";

const generateToken = (payload, expiryTime, secKey) => {
  try {
    return jwt.sign(payload, secKey, {
      expiresIn: expiryTime,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error generating token", error: error.message });
  }
};

module.exports = { constant, expiryTime, generateToken };
