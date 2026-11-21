
const User = require("../model/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

// Signup Controller
module.exports.Signup = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Request body is missing",
                success: false,
            });
        }

        const { email, password, username } = req.body;

        // Validate input
        if (!email || !password || !username) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
                success: false,
            });
        }

        // Create user (password hashed by UserModel middleware)
        const user = await User.create({
            email,
            password,
            username,
        });

        // Generate JWT token
        const token = createSecretToken(user._id);

        // Set authentication cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
            },
        });

    } catch (error) {
        console.error("Signup Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered",
                success: false,
            });
        }

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// Login Controller
module.exports.Login = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Request body is missing",
                success: false,
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        // Compare entered password with stored hash
        const auth = await bcrypt.compare(password, user.password);

        if (!auth) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        // Generate JWT token
        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
