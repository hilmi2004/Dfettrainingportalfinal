import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ["Web Development", "App Development", "Crypto Classes", "UI/UX"],
        index : true
    },
    description: { type: String, required: true },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // Changed to not required
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    duration: {
        type: String,
        enum: ["3 months", "6 months", "12 months"],
        required: true
    },
    teachingMode: {
        type: String,
        enum: ["Online", "Physical"],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "assigned", "active", "completed"],
        default: "pending"
    },
    // In User model or a separate Progress model
    courseProgress: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        progress: { type: Number, default: 0 },
        completedLessons: [{ type: mongoose.Schema.Types.ObjectId }]
    }],
    // In Course model
    lessons: [{
        title: String,
        duration: String,
        content: String
    }],
    image : {type: String},
    enrollmentOpen: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
});

CourseSchema.index({ studentsEnrolled: 1 }, { unique: false, sparse: true });
// Add this after the schema definition
CourseSchema.index(
    { title: 1, duration: 1, teachingMode: 1 },
    { unique: true, name: "course_unique_index" }
);
const Course = mongoose.model("Course", CourseSchema);

export default Course;


// models/Courses.js
// import mongoose from "mongoose";
//
// const CourseSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//         enum: ["Web Development", "App Development", "Crypto Classes", "UI/UX"]
//     },
//     description: { type: String, required: true },
//     instructor: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     studentsEnrolled: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     }],
//     durations: {
//         type: [String],
//         required: true,
//         enum: ["3 months", "6 months", "12 months"]
//     },
//     teachingModes: {
//         type: [String],
//         required: true,
//         enum: ["Online", "Physical"]
//     },
//     basePrice: {
//         type: Number,
//         required: true
//     },
//     image: {
//         type: String,
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ["active", "archived"],
//         default: "active"
//     },
//     lessons: [{
//         title: String,
//         duration: String,
//         content: String,
//         resources: [String]
//     }]
// });
//
// CourseSchema.index({ title: 1 }, { unique: true });
//
// const Course = mongoose.model("Course", CourseSchema);
// export default Course;