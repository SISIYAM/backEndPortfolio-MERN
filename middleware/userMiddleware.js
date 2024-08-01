const jwt = require("jsonwebtoken");
const JWT_SECRET = "iLoveHer";

const userMiddleware = (req, res, next) => {
  // get user from the jwt token
  const token = req.header("auth-token");
  if (!token) {
    res
      .status(401)
      .send({ message: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res
      .status(401)
      .send({ message: "Please authenticate using a valid token" });
  }
};

module.exports = userMiddleware;
