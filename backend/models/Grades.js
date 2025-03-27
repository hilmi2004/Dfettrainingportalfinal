import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    grade: { type: String, required: true }, // Example: "A", "B", "C"
    createdAt: { type: Date, default: Date.now },
});

const Grade = mongoose.model("Grade", GradeSchema);

// Function to assign a grade to a student
const assignGrade = async () => {
    try {
        const grade = await Grade.create({
            student: "5f81c3e8b2823248d2509327", // Ensure valid student ObjectId
            course: "5f81c3e8b2823248d2509326", // Ensure valid course ObjectId
            grade: "A",
        });
        console.log("Grade assigned successfully:", grade);
    } catch (error) {
        console.error("Error assigning grade:", error);
    }
};

// Call function for testing (remove in production)
assignGrade();

export { Grade };
