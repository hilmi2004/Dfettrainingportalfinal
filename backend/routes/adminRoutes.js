// adminRoutes.js
import express from "express";
import Course from "../models/Courses.js";
import { Library } from "../models/Library.js";
import User from "../models/User.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import Announcement from "../models/Announcements.js";
import { syncInstructor } from "../middlewares/instructorSync.js";
const router = express.Router();

// Admin middleware
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

// COURSES
// In your admin courses route
router.get('/courses', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'firstName lastName email')
            .populate('studentsEnrolled', 'firstName lastName');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// In your admin courses route (routes/adminRoutes.js)
router.post('/courses', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, description, instructor, duration, teachingMode, price, status, image } = req.body;

        const course = new Course({
            title,
            description,
            instructor: instructor || null,
            duration,
            teachingMode,
            price,
            status,
            image
        });

        await course.save();

        // If instructor was assigned, update their coursesTaught array
        if (instructor) {
            await User.findByIdAndUpdate(instructor, {
                $addToSet: { coursesTaught: course._id }
            });
        }

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { instructor: newInstructorId, ...updateData } = req.body;
        const courseId = req.params.id;

        // Get current course to check previous instructor
        const currentCourse = await Course.findById(courseId);
        const previousInstructorId = currentCourse.instructor;

        // Update the course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                ...updateData,
                instructor: newInstructorId || null
            },
            { new: true }
        );

        // Handle instructor changes
        if (previousInstructorId?.toString() !== newInstructorId) {
            // Remove from previous instructor's coursesTaught
            if (previousInstructorId) {
                await User.findByIdAndUpdate(previousInstructorId, {
                    $pull: { coursesTaught: courseId }
                });
            }

            // Add to new instructor's coursesTaught
            if (newInstructorId) {
                await User.findByIdAndUpdate(newInstructorId, {
                    $addToSet: { coursesTaught: courseId }
                });
            }
        }

        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
// router.put('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
//     try {
//         const course = await Course.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             {
//                 new: true,
//                 runValidators: true // Ensure validations run on update
//             }
//         );
//
//         if (!course) {
//             return res.status(404).json({ message: "Course not found" });
//         }
//
//         res.json(course);
//     } catch (error) {
//         console.error("Error updating course:", error);
//         res.status(400).json({
//             message: "Error updating course",
//             error: error.message
//         });
//     }
// });

router.delete('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: "Course deleted" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting course", error: error.message });
    }
});



// USERS
router.put('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (role === 'instructor') {
            await syncInstructor(req.params.id, 'create');
        } else {
            await syncInstructor(req.params.id, 'update');
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

// LIBRARY ROUTES
router.get('/library', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const resources = await Library.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

router.post('/library', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newResource = new Library(req.body);
        await newResource.save();
        res.status(201).json(newResource);
    } catch (error) {
        res.status(400).json({
            message: "Error creating resource",
            error: error.message
        });
    }
});

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


router.get('/announcements', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        console.log("Fetching announcements...");
        const announcements = await Announcement.find()
            .populate('author')
            .sort({ createdAt: -1 });

        console.log("Found:", announcements);
        res.json(announcements);

    } catch (error) {
        console.error("FULL ERROR:", error);
        res.status(500).json({
            message: "Error fetching announcements",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

router.post('/announcements', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newAnnouncement = new Announcement({
            ...req.body,
            author: req.user.id
        });
        await newAnnouncement.save();

        const populatedAnnouncement = await Announcement.findById(newAnnouncement._id)
            .populate('author', 'firstName lastName');

        res.status(201).json(populatedAnnouncement);
    } catch (error) {
        res.status(400).json({
            message: "Error creating announcement",
            error: error.message
        });
    }
});

router.put('/announcements/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content
            },
            { new: true }
        ).populate('author', 'firstName lastName');

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.json(announcement);
    } catch (error) {
        res.status(400).json({
            message: "Error updating announcement",
            error: error.message
        });
    }
});

router.delete('/announcements/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
        res.status(400).json({
            message: "Error deleting announcement",
            error: error.message
        });
    }
});




// Similar routes for Library and Users

export default router;