import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { User } from "./models/User.js";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 2000;
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/dfetusers";

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing! Check your .env file.");
    process.exit(1);
}

// Connect to Database
connectDB(DATABASE_URL);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer Transporter (Uses Environment Variables)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to generate a username
const generateUsername = (firstName, lastName) => {
    if (!firstName || !lastName) {
        throw new Error("Both first name and last name are required to generate a username.");
    }
    return `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(1000 + Math.random() * 9000)}`;
};

// Function to generate a random password
const generatePassword = () => Math.random().toString(36).slice(-8);

// Handle Registration and Emails
app.post("/send-email", async (req, res) => {
    console.log("📩 Incoming registration data:", req.body);
    const { firstName, lastName, email, phoneNumber, course, duration, teachingMode, price } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered with this email" });
        }

        // Generate username and password
        const username = generateUsername(firstName, lastName);
        const defaultPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Store user in MongoDB
        const newUser = new User({
            firstName,
            lastName,
            email,
            phoneNumber,
            course,
            duration,
            teachingMode,
            price,
            username,
            password: hashedPassword
        });

        await newUser.save();

        // Email to business
        const businessMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.BUSINESS_EMAIL,
            subject: "New Course Registration",
            text: `New Registration:
            Name: ${firstName} ${lastName}
            Email: ${email}
            Phone number: ${phoneNumber}
            Course: ${course}
            Duration: ${duration}
            Mode: ${teachingMode}
            Price: N${price}
            Username: ${username}`
        };

        // Email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Course Registration Confirmation",
            text: `Hello ${firstName},

            Thank you for registering for the ${course} course!

            Here are your details:
            - Username: ${username}
            - Password: ${defaultPassword} (please change after logging in)
            - Duration: ${duration}
            - Mode of Teaching: ${teachingMode}
            - Price: N${price}

            We look forward to seeing you in class!

            Regards,
            DFET`
        };

        // Send emails
        try {
            await transporter.sendMail(businessMailOptions);
            await transporter.sendMail(userMailOptions);
            console.log("📧 Emails sent successfully");
        } catch (emailError) {
            console.error("❌ Error sending email:", emailError);
        }

        res.status(200).json({ message: "Emails sent successfully!", username });

    } catch (error) {
        console.error("❌ Error processing registration:", error);
        res.status(500).json({ message: "Server error while processing registration" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
