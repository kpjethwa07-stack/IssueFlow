
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const protect = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const issueRoutes = require("./routes/issueRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB before processing API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(503).json({
      success: false,
      message: "Database unavailable. Please try again later.",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "IssueFlow API is running!",
  });
});

app.get("/api/auth/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated!",
    userId: req.user,
  });
});

module.exports = app;
