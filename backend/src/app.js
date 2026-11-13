const protect = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const express=require("express");
const cors=require("cors");
const projectRoutes = require("./routes/projectRoutes");
const issueRoutes = require("./routes/issueRoutes");


const app=express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/issues", issueRoutes);

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
app.use("/api/issues", require("./routes/issueRoutes"));
module.exports=app;
