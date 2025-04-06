// adminRoutes.js
import express from "express";
import Course from "../models/Courses.js";
import { Library } from "../models/Library.js";
import User from "../models/User.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin middleware
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

// COURSES
router.get('/courses', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor studentsEnrolled');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/courses', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: "Error creating course", error: error.message });
    }
});

// LIBRARY
router.get('/library', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const resources = await Library.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/library', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newResource = new Library(req.body);
        await newResource.save();
        res.status(201).json(newResource);
    } catch (error) {
        res.status(400).json({ message: "Error creating resource", error: error.message });
    }
});

// USERS
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Courses
router.put('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(course);
    } catch (error) {
        res.status(400).json({ message: "Error updating course", error: error.message });
    }
});

router.delete('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: "Course deleted" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting course", error: error.message });
    }
});

// LIBRARY
router.put('/library/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const resource = await Library.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(resource);
    } catch (error) {
        res.status(400).json({
            message: "Error updating resource",
            error: error.message
        });
    }
});

router.delete('/library/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await Library.findByIdAndDelete(req.params.id);
        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(400).json({
            message: "Error deleting resource",
            error: error.message
        });
    }
});

// USERS
router.put('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(400).json({
            message: "Error updating user",
            error: error.message
        });
    }
});

router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // First remove user from any courses they're enrolled in
        await Course.updateMany(
            { studentsEnrolled: req.params.id },
            { $pull: { studentsEnrolled: req.params.id } }
        );

        // Then delete the user
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({
            message: "Error deleting user",
            error: error.message
        });
    }
});

// Similar routes for Library and Users

export default router;