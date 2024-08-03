const jwt = require("jsonwebtoken");
const { constant } = require("../myConstants");

const userMiddleware = (req, res, next) => {
  // get user from the jwt token
  const token = req.header("auth-token");
  console.log(token);
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized user" });
  }

  try {
    const data = jwt.verify(token, constant.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized user" });
  }
};

module.exports = userMiddleware;
