const { validateEmailAndPassword } = require("../validators/validators.js");
const Professor = require("../model/professor.js");

// utils
const generateToken = require("../utils/generateToken.js");

const loginProfessor = async (req, res, next) => {
  const data = req.body;
  const { error } = validateEmailAndPassword(data);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
  }

  const { email, password } = data;

  const professor = await Professor.findOne({ email: email });

  if (!professor) {
    return res
      .status(404)
      .json({ message: `User not found with email ${email}` });
  }

  if (professor.password != password) {
    return res
      .status(401)
      .json({ message: "Invalid credentials. Password does not match." });
  }

  const token = generateToken(professor, "professor");

  res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
  res.status(200).json({ success: true, message: "Authentication successful" });
};

module.exports = loginProfessor;
