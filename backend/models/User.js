import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define User Schema
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    course: {
        type: String,
        required: function() {
            return this.role === "student" && !this.enrolledCourses?.length
        }
    },
    duration: {
        type: String,
        required: function() {
            return this.role === "student" && !this.enrolledCourses?.length
        }
    },
    teachingMode: {
        type: String,
        required: function() {
            return this.role === "student" && !this.enrolledCourses?.length
        }
    },
    price: {
        type: Number,
        required: function() {
            return this.role === "student" && !this.enrolledCourses?.length
        }
    },
    password: { type: String, required: true }, // Store hashed password
    role: {
        type: String,
        enum: ["student", "instructor", "admin"], // Allowed roles
        default: "student"
    },
    points: { type: Number, default: 0 }, // Default points to 0
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
});

UserSchema.index({ enrolledCourses: 1 }, { unique: false, sparse: true });


// Hash password before saving user
// In User.js
UserSchema.pre("save", async function (next) {
    console.log("Modified fields:", this.modifiedPaths()); // Debug log
    if (!this.isModified("password")) {
        console.log("Password not modified - skipping hash");
        return next();
    }
    console.log("Hashing password for:", this.email);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to check password validity
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create User model
const User = mongoose.model("User", UserSchema);

export default User;
