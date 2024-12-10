const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const URI = process.env.MONGO_URI || "your-mongo-uri-here";
    await mongoose.connect(URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process if the DB connection fails
  }
};

module.exports = connectDB;
