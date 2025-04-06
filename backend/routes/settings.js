// routes/settings.js
import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get user settings
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -__v -createdAt -updatedAt');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            profile: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                bio: user.bio || ''
            },
            notifications: {
                courseUpdates: user.notifications?.courseUpdates ?? true,
                assignmentReminders: user.notifications?.assignmentReminders ?? true,
                gradeNotifications: user.notifications?.gradeNotifications ?? true,
                announcements: user.notifications?.announcements ?? true,
                marketingEmails: user.notifications?.marketingEmails ?? false
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, bio } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                firstName,
                lastName,
                phoneNumber,
                bio
            },
            { new: true }
        ).select('-password -__v');

        res.json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
});

// Update notifications
router.put('/notifications', authMiddleware, async (req, res) => {
    try {
        const {
            courseUpdates,
            assignmentReminders,
            gradeNotifications,
            announcements,
            marketingEmails
        } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                notifications: {
                    courseUpdates,
                    assignmentReminders,
                    gradeNotifications,
                    announcements,
                    marketingEmails
                }
            },
            { new: true }
        ).select('-password -__v');

        res.json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update notifications",
            error: error.message
        });
    }
});

// Logout endpoint
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        // In a real app, you might want to invalidate the token here
        res.clearCookie('token');
        res.json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message
        });
    }
});

export default router;