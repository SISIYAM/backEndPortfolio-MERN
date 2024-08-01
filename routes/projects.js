const express = require("express");
const { body, validationResult } = require("express-validator"); // Import `body` from `express-validator`
const router = express.Router();
const Project = require("../models/Project");

// Validation middleware
const validateProject = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("description")
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters long"),
  body("frontEnd")
    .isLength({ min: 3 })
    .withMessage("FrontEnd must be at least 3 characters long"),
  body("backEnd")
    .isLength({ min: 3 })
    .withMessage("BackEnd must be at least 3 characters long"),
];

//end point for add projects
router.post("/add", validateProject, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new project using the data from the request body
    const newProject = new Project(req.body);

    // Save the project to MongoDB
    await newProject.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    // Handle any errors that occur
    res
      .status(400)
      .json({ message: "Error creating project", error: error.message });
  }
});

// end point for fetch all projects where status is true

router.get("/fetch", async (req, res) => {
  const allProjects = await Project.find({ status: true });
  res.json(allProjects);
  console.log(allProjects);
});

module.exports = router;
