const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middleware/userMiddleware");
const constant = require("../myConstants");

// Validation middleware for user registration
const validateUser = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("User must be at least 3 characters long"),
  body("email").isEmail().withMessage("Email must be a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .isLength({ min: 6 })
    .withMessage("Confirm Password must be at least 6 characters long"),
];

// Endpoint for adding a new user
router.post("/add", validateUser, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Match password and confirm password
    if (req.body.password !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password didn't match" });
    }

    // Secure password
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);

    // Create user
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: secPassword,
    });

    const data = {
      user: {
        id: user.id,
      },
    };

    let authenticationToken;
    try {
      authenticationToken = jwt.sign(data, constant.JWT_SECRET);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error generating token", error: error.message });
    }

    // Send response
    res.status(201).json({
      success: true,
      authenticationToken: authenticationToken,
    });
  } catch (error) {
    // Handle any errors that occur
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

// Validation middleware for login
const validationLogin = [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
  body("password", "Password must be at least 6 characters long").isLength({
    min: 6,
  }),
];

// Endpoint for user login
router.post("/login", validationLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({ message: "Please try to login with correct credentials" });
    }

    const passwordVerify = await bcrypt.compare(password, user.password);

    if (!passwordVerify) {
      return res
        .status(403)
        .json({ message: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    let authenticationToken;
    try {
      authenticationToken = jwt.sign(data, constant.JWT_SECRET, {
        expiresIn: "10s",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error generating token", error: error.message });
    }

    // Send response
    res.status(200).json({ success: true, authenticationToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }
});

// get logged in user details
router.post("/getUser", userMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.log(error.message);
  }
});

module.exports = router;
