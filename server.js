const express = require("express");
require("dotenv/config");
const cookieParser = require("cookie-parser");

// import connection db
const connectDB = require("./config/db.js");

// import routes
const authRouter = require("./routes/authRouter.js");
const professorRouter = require("./routes/professor.js");
const studentRouter = require("./routes/student.js");
const authenticateToken = require("./middlewares/authenticateToken.js");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().catch((err) => {
  console.error("Database connection failed", err);
  process.exit(1);
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/professor", authenticateToken, professorRouter);
app.use("/api/v1/student", authenticateToken, studentRouter);

// Catch 404
app.use((req, res, next) => {
  console.log(req.url);
  res.status(404).json({ error: "Route not found" });
});

const server = app.listen(PORT, () => {
  console.log(`Running server at port ${PORT}`);
});

module.exports = server;
