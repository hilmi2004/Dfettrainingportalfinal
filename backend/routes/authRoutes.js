import express from "express";
import { loginUser, forgotPassword, resetPassword } from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import  User from "../models/User.js"
const router = express.Router();

// Login Route
router.post("/login", loginUser);

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route
router.post("/reset-password/:token", resetPassword);

// User profile route
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate("enrolledCourses.course");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                enrolledCourses: user.enrolledCourses
            }
        });
    } catch (error) {
        console.error("Error in /me endpoint:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;