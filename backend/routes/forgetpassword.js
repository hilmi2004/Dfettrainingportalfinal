import express from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import PasswordReset from "../models/PasswordReset.js";
import User from "../models/User.js";

const router = express.Router();

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "gabihilmi4@gmail.com",  // Replace with your actual email
        pass: process.env.EMAIL_PASS,         // Use environment variables instead of hardcoding passwords!
    },
});

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString("hex");
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;

        // Store token in database with expiration time (1 hour)
        await PasswordReset.create({ email, token, expiresAt: Date.now() + 3600000 });

        // Send email
        await transporter.sendMail({
            from: "gabihilmi4@gmail.com",  // Replace with your actual email
            to: email,
            subject: "Password Reset",
            text: `Click here to reset your password: ${resetLink}`,
        });

        res.json({ success: true, message: "Reset email sent" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
