import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coursesTaught: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    createdAt: { type: Date, default: Date.now },
});

const Instructor = mongoose.model("Instructor", InstructorSchema);

// Function to create an instructor
const createInstructor = async () => {
    try {
        const instructor = await Instructor.create({
            fullName: "Jane Smith",
            email: "onehksdj2@gmail.com",
            password: "securepass123",
            coursesTaught: ["5f81c3e8b2823248d2509326"], // Ensure valid course ObjectId
        });
        console.log("Instructor created successfully:", instructor);
    } catch (error) {
        console.error("Error creating instructor:", error);
    }
};

// Call function for testing (remove in production)


export { Instructor };
