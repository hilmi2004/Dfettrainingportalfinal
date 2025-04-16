// models/Instructor.js
import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    coursesTaught: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    bio: { type: String },
    profileImage: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Instructor = mongoose.model("Instructor", InstructorSchema);

export { Instructor };