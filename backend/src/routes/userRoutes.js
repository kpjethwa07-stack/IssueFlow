
const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET USERS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const users = await User.find()
            .select("_id name username email")
            .sort({ username: 1 });

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
});

module.exports = router;
