// seedCourses.js
import Course from "./models/Courses.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const courses = [
    {
        title: "Web Development",
        description: "Full-stack web development course covering modern technologies",
        durations: ["3 months", "6 months", "12 months"],
        teachingModes: ["Online", "Physical"],
        basePrice: 50000,
        image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29",
        lessons: []
    },
    {
        title: "App Development",
        description: "Native mobile app development for iOS and Android",
        durations: ["3 months", "6 months"],
        teachingModes: ["Online"],
        basePrice: 60000,
        image: "https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7",
        lessons: []
    }
    // Add other courses...
];

const seedCourses = async () => {
    await mongoose.connect(process.env.DATABASE_URL);

    for (const course of courses) {
        await Course.findOneAndUpdate(
            { title: course.title },
            course,
            { upsert: true }
        );
    }

    console.log("Courses seeded successfully");
    process.exit();
};

seedCourses();