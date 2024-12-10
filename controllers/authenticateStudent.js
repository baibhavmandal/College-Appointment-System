const { validateEmailAndPassword } = require("../validators/validators.js");
const Student = require("../model/student.js");

// import utils
const generateToken = require("../utils/generateToken.js");

const loginStudent = async (req, res, next) => {
  const data = req.body;
  const { error } = validateEmailAndPassword(data);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
  }

  const { email, password } = req.body;

  const student = await Student.findOne({ email: email });

  if (!student) {
    return res
      .status(404)
      .json({ message: `User not found with email ${email}` });
  }

  if (student.password != password) {
    return res
      .status(401)
      .json({ message: "Invalid credentials. Password does not match." });
  }

  const token = generateToken(student, "student");

  res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
  res.status(200).json({ success: true, message: "Authentication successful" });
};

module.exports = loginStudent;
