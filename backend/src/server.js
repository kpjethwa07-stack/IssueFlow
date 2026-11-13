require("dotenv").config();
const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");

dotenv.config();

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`IssueFlow is running at ${PORT}`);
    });
};
app.use("/api/issues", require("./routes/issueRoutes"));
startServer();
