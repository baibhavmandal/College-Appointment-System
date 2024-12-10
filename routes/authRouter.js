const express = require("express");

// import auth controllers
const loginProfessor = require("../controllers/authenticateProfessor.js");
const loginStudent = require("../controllers/authenticateStudent.js");

const router = express.Router();

router.post("/professor", loginProfessor).post("/student", loginStudent);

module.exports = router;
