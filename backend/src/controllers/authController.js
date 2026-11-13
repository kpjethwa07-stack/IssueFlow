
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, username, email and password are required",
            });
        }

        const cleanUsername = username.trim().toLowerCase();
        const cleanEmail = email.trim().toLowerCase();

        if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
            return res.status(400).json({
                success: false,
                message: "Username must be 3-20 characters using letters, numbers or underscores",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters",
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: cleanEmail },
                { username: cleanUsername },
            ],
        });

        if (existingUser) {
            const message =
                existingUser.email === cleanEmail
                    ? "Email already registered"
                    : "Username already taken";

            return res.status(409).json({
                success: false,
                message,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern || {})[0];

            return res.status(409).json({
                success: false,
                message:
                    duplicateField === "username"
                        ? "Username already taken"
                        : "Email already registered",
            });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email?.trim().toLowerCase(),
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username || null,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = { registerUser, loginUser };
