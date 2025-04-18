import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from "./models/User.js";
import Course from "./models/Courses.js"; // Import Course model
import PasswordReset from "./models/PasswordReset.js";
import authRoutes from "./routes/authRoutes.js";
// import settingsRoutes from "./routes/settings.js"
import settingsRouter from './routes/settings.js';
// server.js
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js";
import {authMiddleware} from "./middlewares/authMiddleware.js";
import {Library} from "./models/Library.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Announcement from "./models/Announcements.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import {cookieOptions} from "./config/cookies.js";

// Add after other route imports


// Add after other middleware

dotenv.config();



console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("JWT_SECRET:", process.env.JWT_SECRET); // (avoid logging sensitive info in production)

const app = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 2000;
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/dfetusers";

// Database Connection
connectDB(DATABASE_URL);

// Middleware

// Replace existing CORS middleware
// Replace existing CORS middleware with:
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : 'https://yourdomain.com',
    credentials: true,
    exposedHeaders: ['set-cookie'] // Add this line
}));
// Handle OPTIONS requests
// app.options('*', cors());

// Cookie configuration middleware
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
// });

app.use((req, res, next) => {
    console.log('Incoming cookies:', req.cookies);
    console.log('Incoming headers:', req.headers);
    next();
});

app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }
    next();
});


// i need it to find a way to ifix all the errors by enabling a more secure way to check that the refresh token logic is working well and also i have to do all of this before maybe 8pm today and start working on the logic for something else maybe the payment system











// Email Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper Functions
const generateUsername = (firstName, lastName) => {
    return `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(1000 + Math.random() * 9000)}`;
};

const generatePassword = () => Math.random().toString(36).slice(-8);

// COURSE-RELATED ENDPOINTS

// Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor studentsEnrolled');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});



// Get courses for a specific user
// Get courses for a specific user
// Get courses for a specific user
// In your server route (index.js)
// Wrap your API routes with error handling
// In your server (index.js)
app.get('/api/users/:userId/courses', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate({
                path: 'enrolledCourses.course',
                select: 'title description instructor duration teachingMode price image lessons', // Include all needed fields
                populate: {
                    path: 'instructor',
                    select: 'firstName lastName' // Ensure instructor details are included
                }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter out invalid or incomplete courses
        const validCourses = user.enrolledCourses.filter(ec =>
            ec.course &&
            ec.course.title &&
            ec.course._id
        );

        res.json(validCourses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
// REGISTRATION ENDPOINT (Updated)
// In index.js
app.post("/send-email", async (req, res) => {
    const {
        firstName = "",
        lastName = "",
        email = "",
        phoneNumber = "",
        course = "",
        duration = "",
        teachingMode = "",
        price = null
    } = req.body;

    // Validation
    const errors = {};
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phoneNumber.trim();
    const trimmedCourse = course.trim();
    const trimmedDuration = duration.trim();
    const trimmedMode = teachingMode.trim();

    if (!trimmedFirstName) errors.firstName = "First name is required";
    if (!trimmedLastName) errors.lastName = "Last name is required";
    if (!trimmedEmail) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        errors.email = "Please enter a valid email address";
    }
    if (!trimmedPhone) errors.phoneNumber = "Phone number is required";
    if (!trimmedCourse) errors.course = "Please select a course";
    if (!trimmedDuration) errors.duration = "Please select duration";
    if (!trimmedMode) errors.teachingMode = "Please select teaching mode";
    if (price === null || price === undefined || isNaN(Number(price))) {
        errors.price = "Valid price is required";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email: trimmedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
                errors: { email: "This email is already in use" }
            });
        }

        // Check for existing course or create new
        let courseToEnroll;
        try {
            courseToEnroll = await Course.findOne({
                title: trimmedCourse,
                duration: trimmedDuration,
                teachingMode: trimmedMode


            });

            if (!courseToEnroll) {
                courseToEnroll = new Course({
                    title: trimmedCourse,
                    description: `${trimmedCourse} (${trimmedDuration}, ${trimmedMode})`,
                    duration: trimmedDuration,
                    teachingMode: trimmedMode,
                    price: Number(price),
                    status: "pending",
                    image: getCourseImage(trimmedCourse),
                    lessons: [],
                    startDate: new Date(),
                    studentsEnrolled: [] // Initialize properly
                });

                await courseToEnroll.save();
            }
        } catch (courseError) {
            if (courseError.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: "This course configuration already exists",
                    errors: { course: "Course already exists" }
                });
            }
            throw courseError;
        }

        // Create user
        const username = generateUsername(trimmedFirstName, trimmedLastName);
        const tempPassword = generatePassword();

        const newUser = new User({
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            email: trimmedEmail,
            phoneNumber: trimmedPhone,
            username,
            password: tempPassword,
            role: "student",
            enrolledCourses: [{ course: courseToEnroll._id }],
            profileImage: "" // Let the model use default value
        });

        await newUser.save();

        // Update course enrollment
        courseToEnroll.studentsEnrolled.push(newUser._id);
        await courseToEnroll.save();

        // Send emails (existing implementation)
        const businessEmail = {
            from: process.env.EMAIL_USER,
            to: process.env.BUSINESS_EMAIL,
            subject: `New Registration: ${trimmedCourse}`,
            html: `
                <h2>New Registration</h2>
                <p><strong>Student:</strong> ${trimmedFirstName} ${trimmedLastName}</p>
                <p><strong>Course:</strong> ${trimmedCourse} (${trimmedDuration})</p>
                <p><strong>Mode:</strong> ${trimmedMode}</p>
                <p><strong>Price:</strong> N${Number(price).toLocaleString()}</p>
                <p><strong>Credentials:</strong> ${username} / ${tempPassword}</p>
                <p><strong>Contact:</strong> ${trimmedPhone} | ${trimmedEmail}</p>
            `
        };

        const userEmail = {
            from: process.env.EMAIL_USER,
            to: trimmedEmail,
            subject: `Your ${trimmedCourse} Registration`,
            html: `
                <p>Dear ${trimmedFirstName},</p>
                <p>Your registration for <strong>${trimmedCourse}</strong> was successful!</p>
                <p>Course Details:</p>
                <ul>
                    <li>Duration: ${trimmedDuration}</li>
                    <li>Mode: ${trimmedMode}</li>
                    <li>Price: N${Number(price).toLocaleString()}</li>
                </ul>
                <p>Your login credentials:</p>
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Temporary Password:</strong> ${tempPassword}</p>
                <p style="color: #dc3545; font-weight: bold;">
                    Please change your password after first login.
                </p>
                <p>Access your dashboard: 
                    <a href="http://localhost:5173/login" style="color: #2563eb;">
                        http://localhost:5173/login
                    </a>
                </p>
                <p>Best regards,<br/>The Academy Team</p>
            `
        };

        await transporter.sendMail(businessEmail);
        await transporter.sendMail(userEmail);

        res.status(201).json({
            success: true,
            message: "Registration successful! Check your email for credentials.",
            data: {
                userId: newUser._id,
                courseId: courseToEnroll._id
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : "Please try again later"
        });
    }
});

// Helper function (keep existing implementation)
const getCourseImage = (title) => {
    const courseImages = {
        "Web Development": "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "App Development": "https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBwJTIwZGV2fGVufDB8fDB8fHww",
        "Crypto Classes": "https://images.unsplash.com/photo-1629877521896-4719f02df3c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8",
        "UI/UX": "https://images.unsplash.com/photo-1621111848501-8d3634f82336?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHVpJTJGdXh8ZW58MHx8MHx8fDA%3D"
    };
    return courseImages[title] || "https://images.unsplash.com/photo-1621111848501-8d3634f82336?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHVpJTJGdXh8ZW58MHx8MHx8fDA%3D";
};
// Forgot Password Route
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate a reset token (For simplicity, we use a random string. Ideally, use JWT)
        const resetToken = Math.random().toString(36).substr(2, 12);

        // Store the token in the database
        await PasswordReset.create({
            email,
            token: resetToken,
            expiresAt: Date.now() + 3600000 // Token expires in 1 hour
        });

        // Send email with reset link
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>
                   <p>If you did not request this, please ignore this email.</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Password reset email sent");

        res.status(200).json({ success: true, message: "Reset link sent to your email." });

    } catch (error) {
        console.error("❌ Forgot Password Error:", error);
        res.status(500).json({ success: false, message: "Server error, please try again." });
    }
});

// Reset Password Route
// In index.js (Reset Password Route)
app.post("/api/auth/reset-password/:token", async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        const resetRequest = await PasswordReset.findOne({ token });
        if (!resetRequest || resetRequest.expiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        }

        // Fetch user as a Mongoose document (not plain object)
        const user = await User.findOne({ email: resetRequest.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Force password modification detection
        user.set("password", password); // Use set() instead of direct assignment
        await user.save();

        // Delete token
        await PasswordReset.deleteOne({ token });

        res.json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

    // Add this after other course routes
// In index.js - Modify the existing enrollment route
app.post('/api/courses/enroll', async (req, res) => {
    try {
        const { courseId } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ success: false, message: "User or course not found" });
        }

        const courseObjectId = new mongoose.Types.ObjectId(courseId);

        // Modified enrollment check
        const isEnrolled = await User.exists({
            _id: user._id,
            "enrolledCourses.course": courseObjectId // Changed to check nested field
        });

        if (isEnrolled) {
            return res.status(409).json({
                success: false,
                message: "Already enrolled in this course"
            });
        }

        // Modified enrollment update - Add this block
        await User.findByIdAndUpdate(user._id, {
            $addToSet: {
                enrolledCourses: {
                    course: courseObjectId,
                    enrollmentDate: new Date() // Individual start time
                }
            }
        });

        // Rest of the code remains the same
        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { studentsEnrolled: user._id }
        });

        res.json({
            success: true,
            message: "Enrollment successful",
            course: course
        });

    } catch (error) {
        console.error("Enrollment error:", error);
        res.status(500).json({
            success: false,
            message: "Enrollment failed",
            error: error.message
        });
    }
});

// Add near other routes in index.js
// Modify the /api/library route to properly populate course titles
// Get library resources
// In index.js - Update the /api/library route
app.get('/api/library', authMiddleware, async (req, res) => {
    try {
        // Correct population path
        const user = await User.findById(req.user.id)
            .populate('enrolledCourses.course'); // Populate the nested 'course' field

        // Get titles from the populated course references
        const userCourseTitles = user.enrolledCourses.map(
            ec => ec.course?.title // Safely access nested title
        ).filter(title => title); // Remove any undefined values

        const resources = await Library.find({
            category: { $in: userCourseTitles }
        });

        res.json(resources);
    } catch (error) {
        console.error("Library error:", error);
        res.status(500).json({ message: "Failed to load library resources" });
    }
});

// Download resource
// In your index.js file
app.get('/api/library/download/:resourceId', authMiddleware, async (req, res) => {
    try {
        const resource = await Library.findById(req.params.resourceId);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // Verify user has access to this resource's category
        const user = await User.findById(req.user.id).populate('enrolledCourses.course');

        // Check if user is admin or enrolled in a course with matching category
        const hasAccess = req.user.role === 'admin' ||
            user.enrolledCourses.some(ec =>
                ec.course && ec.course.title === resource.category
            );

        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied to this resource" });
        }

        // Update download count
        await Library.findByIdAndUpdate(resource._id, {
            $inc: { downloadCount: 1 }
        });

        // Return the file URL (or serve the file directly)
        res.json({
            fileUrl: resource.fileUrl,
            message: "Download started"
        });
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ message: "Download failed" });
    }
});
// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Resource file upload endpoint
app.post('/api/upload/resource', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.json({
            success: true,
            fileUrl,
            message: 'File uploaded successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to upload file',
            error: error.message
        });
    }
});

// Image upload endpoint
app.post('/api/upload/image', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.json({
            success: true,
            imageUrl,
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
});

app.post('/clear-cookies', (req, res) => {
    res
        .clearCookie('accessToken', cookieOptions)
        .clearCookie('refreshToken', cookieOptions)
        .send('Cookies cleared');
});


// Add this near your other routes
app.get('/api/announcements', authMiddleware, async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate('author', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(5); // Only get recent announcements

        res.json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({
            message: "Error fetching announcements",
            error: error.message
        });
    }
});

// Add to index.js
app.get('/api/instructors', async (req, res) => {
    try {
        const instructors = await User.find({ role: 'instructor' })
            .populate('coursesTaught', 'title description')
            .select('fullName email profileImage coursesTaught');

        res.json(instructors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching instructors", error: error.message });
    }
});


// Add this emergency route to your server



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRouter);
app.use("/api/instructor", instructorRoutes);
app.use('/uploads', express.static('public/uploads'));


// app.use("/api/auth", loginRoute);
// In your server's login route (server.js)

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
