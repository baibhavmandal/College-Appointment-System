const jwt = require("jsonwebtoken");

const generateToken = (user, role) => {
  const playload = { id: user._id, role: role, email: user.email };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" };

  return jwt.sign(playload, secret, options);
};

module.exports = generateToken;
