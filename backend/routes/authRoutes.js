// authRoutes.js
import express from "express";
import { loginUser, forgotPassword } from "../controllers/authControllers.js";
import PasswordReset from "../models/PasswordReset.js";
import User from "../models/User.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Login Route
router.post("/login", loginUser);

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route (Fixed)
router.post("/reset-password/:token", async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        // Find the reset request
        const resetRequest = await PasswordReset.findOne({ token });
        if (!resetRequest || resetRequest.expiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        }

        // Find the user
        const user = await User.findOne({ email: resetRequest.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Update password (pre-save hook will handle hashing)
        user.password = password;
        await user.save();

        // Delete the reset token
        await PasswordReset.deleteOne({ token });

        res.json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

// User profile route
// authRoutes.js
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Enrolled courses route
// In authRoutes.js
// In authRoutes.js
router.get("/users/:userId/courses", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate({
                path: "enrolledCourses",
                select: "-__v -createdAt -status", // Exclude unnecessary fields
                populate: {
                    path: "instructor",
                    select: "firstName lastName -_id"
                }
            });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Convert Mongoose documents to plain objects
        const courses = user.enrolledCourses.map(course => course.toObject());

        res.json(courses);
        console.log("Raw courses:", user.enrolledCourses);
        console.log("Converted courses:", courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error });
    }
});

// Add this after other course routes

export default router;