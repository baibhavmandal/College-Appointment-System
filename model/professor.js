const mongoose = require("mongoose");

const professorSchema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

const Professor = mongoose.model("Professor", professorSchema);

module.exports = Professor;
