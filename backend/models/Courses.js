import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", CourseSchema);

// Function to create a sample course
const createCourse = async () => {
    try {
        const course = await Course.create({
            title: "Introduction to Programming",
            description: "A beginner-friendly course covering the basics of programming.",
            instructor: "5f81c3e8b2823248d2509326", // Ensure this is a valid instructor ObjectId
            studentsEnrolled: ["5f81c3e8b2823248d2509327"], // Valid student ObjectIds
        });
        console.log("Course created successfully:", course);
    } catch (error) {
        console.error("Error creating course:", error);
    }
};

// Call function for testing (remove in production)
createCourse();

export { Course };
