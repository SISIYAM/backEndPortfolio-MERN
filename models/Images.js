const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema({
  projectID: {
    type: mongoose.Types.ObjectId,
    ref: "Project",
  },
  path: {
    type: String,
    required: true,
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
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
