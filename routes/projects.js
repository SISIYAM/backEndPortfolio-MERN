const mongoose = require("mongoose");
const express = require("express");
const { body, validationResult } = require("express-validator"); // Import `body` from `express-validator`
const router = express.Router();
const Project = require("../models/Project");
const userMiddleware = require("../middleware/userMiddleware");
const upload = require("../middleware/uploadMiddleware");
const Image = require("../models/Images");

// validation middleware
const validateProject = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("description")
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters long"),
  // body("frontEnd")
  //   // .isArray()
  //   // .withMessage("FrontEnd must be an array")
  //   .custom((value) => value.length > 0)
  //   .withMessage("FrontEnd array must contain at least one element"),

  // body("backEnd")
  //   // .isArray()
  //   // .withMessage("BackEnd must be an array")
  //   .custom((value) => value.length > 0)
  //   .withMessage("BackEnd array must contain at least one element"),
];

//end point for add projects when admin logged in
router.post(
  "/add",
  userMiddleware,
  upload.array("images", 10),
  validateProject,
  async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // create a new project using the data from the request body
      const newProject = new Project({
        title: req.body.title,
        description: req.body.description,
        frontEnd: req.body.frontEnd,
        backEnd: req.body.backEnd,
      });
      // save the project to MongoDB
      await newProject.save();

      // save images
      req.files.map(async (file) => {
        await Image.create({
          projectID: newProject.id,
          path: file.path,
        });
      });
      console.log(req.body);
      res.status(201).json({
        success: true,
        message: "Project created successfully",
        project: newProject,
      });
    } catch (error) {
      // handle any errors that occur
      res
        .status(400)
        .json({ message: "Error creating project", error: error.message });
    }
  }
);

// end point for fetch all projects when admin logged in and where status is true
router.get("/fetch", userMiddleware, async (req, res) => {
  try {
    const allProjects = await Project.find({});
    res.json({ success: true, allProjects });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// end point for fetch all projects when admin logged in and where status is true
router.get("/fetch/images/:projectId", userMiddleware, async (req, res) => {
  try {
    const images = await Image.find({
      status: true,
      projectID: req.params.projectId,
    });
    res.json({ success: true, images });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// end point for update projects
router.put(
  "/update/:id",
  userMiddleware,
  upload.array("images", 10),
  validateProject,
  async (req, res) => {
    const { title, description, frontEnd, backEnd, status } = req.body;

    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // new data for update if !null
      const newData = {};
      if (title) {
        newData.title = title;
      }
      if (description) {
        newData.description = description;
      }
      if (frontEnd) {
        newData.frontEnd = frontEnd;
      }
      if (backEnd) {
        newData.backEnd = backEnd;
      }

      newData.status = status;

      newData.updated_at = Date.now();

      //first check is id valid or not
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: "Project not found" });
      }

      // search project
      let project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Note found" });
      }

      project = await Project.findByIdAndUpdate(
        req.params.id,
        { $set: newData },
        { new: true }
      );

      // save images
      req.files.map(async (file) => {
        await Image.create({
          projectID: req.params.id,
          path: file.path,
        });
      });

      return res
        .status(200)
        .json({ success: "true", message: "Updated successfully", project });
    } catch (error) {
      // handle any errors that occur
      res
        .status(400)
        .json({ message: "Error creating project", error: error.message });
    }
  }
);

// end point for delete projects when admin was logged in
router.delete("/delete/:id", userMiddleware, async (req, res) => {
  try {
    // check is id valid or not
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Project not found" });
    }
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // get project title before delete
    const title = project.title;
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `${title} deleted successfully` });
  } catch (error) {
    // Handle any errors that occur
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
});

module.exports = router;
