import express from "express";
import Course from "../models/Courses.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Course (Admin only)
router.post("/courses", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Course
router.put("/courses/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;