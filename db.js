const mongoose = require("mongoose");
const constant = require("./myConstants");

const connectToMongo = async () => {
  try {
    await mongoose.connect(constant.mongoUrl);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

module.exports = connectToMongo;
