import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import Course from "../models/Courses.js";
import User from "../models/User.js";
import {Inbox}  from "../models/Inbox.js";

const router = express.Router();

// Instructor middleware
const instructorMiddleware = (req, res, next) => {
    if (req.user.role !== 'instructor') {
        return res.status(403).json({ message: "Instructor access required" });
    }
    next();
};

// Get all instructors (accessible to admin and potentially others)
// routes/instructorRoutes.js
router.get('/instructors', authMiddleware, async (req, res) => {
    try {
        console.log("Fetching instructors..."); // Debug log

        // Verify the user has permission (admin or instructor)
        if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
            return res.status(403).json({ message: "Access denied" });
        }

        const instructors = await User.find({ role: 'instructor' })
            .select('firstName lastName email profileImage coursesTaught')
            .populate({
                path: 'coursesTaught',
                select: 'title duration',
                match: { status: 'active' } // Only include active courses
            });

        console.log("Found instructors:", instructors.length); // Debug log

        const result = instructors.map(instructor => ({
            _id: instructor._id,
            fullName: `${instructor.firstName} ${instructor.lastName}`,
            email: instructor.email,
            profileImage: instructor.profileImage || 'default-profile-image-url',
            coursesTaught: instructor.coursesTaught || []
        }));

        res.json(result);
    } catch (error) {
        console.error("Error in /instructors route:", error);
        res.status(500).json({
            message: "Error fetching instructors",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Get instructor's courses (instructor-only)
router.get('/courses', authMiddleware, instructorMiddleware, async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id })
            .populate('studentsEnrolled', 'firstName lastName email')
            .select('title duration studentsEnrolled');

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get students for a specific course (instructor-only)
router.get('/courses/:courseId/students', authMiddleware, instructorMiddleware, async (req, res) => {
    try {
        // Verify the course belongs to the requesting instructor
        const course = await Course.findOne({
            _id: req.params.courseId,
            instructor: req.user.id
        }).populate('studentsEnrolled', 'firstName lastName email phoneNumber');

        if (!course) {
            return res.status(404).json({ message: "Course not found or access denied" });
        }

        res.json(course.studentsEnrolled);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Send message to student (instructor-only)
router.post('/message', authMiddleware, instructorMiddleware, async (req, res) => {
    try {
        const { recipient, subject, message } = req.body;

        // Verify recipient is a student in one of the instructor's courses
        const isStudentInCourse = await Course.exists({
            instructor: req.user.id,
            studentsEnrolled: recipient
        });

        if (!isStudentInCourse) {
            return res.status(403).json({ message: "Can only message students in your courses" });
        }

        const newMessage = new Inbox({
            sender: req.user.id,
            recipient,
            subject,
            message
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
});

// Get message history (instructor-only)
router.get('/messages', authMiddleware, instructorMiddleware, async (req, res) => {
    try {
        const messages = await Inbox.find({
            $or: [
                { sender: req.user.id },
                { recipient: req.user.id }
            ]
        })
            .populate('sender recipient', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
});

export default router;