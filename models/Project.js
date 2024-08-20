const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  frontEnd: {
    type: [String],
  },
  backEnd: {
    type: [String],
  },
  status: {
    type: Boolean,
    default: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  images: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Image",
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
