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

// server.js
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js";

// Add after other middleware

dotenv.config();

const app = express();
const port = process.env.PORT || 2000;
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/dfetusers";

// Database Connection
connectDB(DATABASE_URL);

// Middleware

// Replace existing CORS middleware
// Replace existing CORS middleware with:

app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Set-Cookie"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Handle preflight requests properly


// Handle preflight requests

// Your login route
// app.post('/api/auth/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//
//         // Validation
//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email and password are required"
//             });
//         }
//
//         // Find user with case-insensitive email
//         const user = await User.findOne({
//             email: email.toLowerCase().trim()
//         });
//
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid credentials"
//             });
//         }
//
//         // Password verification with debug logging
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log('Password Comparison:', {
//             input: password,
//             storedHash: user.password,
//             match: isMatch
//         });
//
//         if (!isMatch) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid credentials"
//             });
//         }
//
//         // JWT Token Generation
//         const token = jwt.sign(
//             {
//                 userId: user._id,
//                 email: user.email,
//                 role: user.role
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );
//
//         // Secure Cookie Settings
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//             maxAge: 3600000,
//             domain: 'localhost',
//             path: '/'
//         });
//
//         // Successful Response
//         return res.status(200).json({
//             success: true,
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 role: user.role
//             }
//         });
//
//     } catch (error) {
//         console.error('Login Error:', error);
//         return res.status(500).json({
//             success: false,
//             message: "Authentication failed"
//         });
//     }
// });


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



// Get courses for a specific user
app.get('/api/users/:userId/courses', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('enrolledCourses');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.enrolledCourses);
    } catch (error) {
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
                    lessons: []
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
            enrolledCourses: [courseToEnroll._id]
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

        // Convert to ObjectId for proper comparison
        const courseObjectId = new mongoose.Types.ObjectId(courseId);

        // Check for existing enrollment using $in operator
        const isEnrolled = await User.exists({
            _id: user._id,
            enrolledCourses: { $in: [courseObjectId] }
        });

        if (isEnrolled) {
            return res.status(409).json({
                success: false,
                message: "Already enrolled in this course"
            });
        }

        // Add to enrolled courses
        await User.findByIdAndUpdate(user._id, {
            $addToSet: { enrolledCourses: courseObjectId } // Prevent duplicates
        });

        // Add user to course's students
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
// Add this emergency route to your server



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/auth", loginRoute);
// In your server's login route (server.js)

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
