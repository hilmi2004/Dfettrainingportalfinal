import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { syncInstructor } from "../middlewares/instructorSync.js";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true
    },
    course: {
        type: String,
        required: function() {
            return this.role === "student" &&
                (!this.enrolledCourses || this.enrolledCourses.length === 0);
        }
    },
    duration: {
        type: String,
        required: function() {
            return this.role === "student" &&
                (!this.enrolledCourses || this.enrolledCourses.length === 0);
        }
    },
    teachingMode: {
        type: String,
        required: function() {
            return this.role === "student" &&
                (!this.enrolledCourses || this.enrolledCourses.length === 0);
        }
    },
    price: {
        type: Number,
        required: function() {
            return this.role === "student" &&
                (!this.enrolledCourses || this.enrolledCourses.length === 0);
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student"
    },
    points: {
        type: Number,
        default: 0,
        min: [0, "Points cannot be negative"]
    },
    enrolledCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        enrollmentDate: {
            type: Date,
            default: Date.now
        }
    }],
    bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"]
    },
    notifications: {
        courseUpdates: { type: Boolean, default: true },
        assignmentReminders: { type: Boolean, default: true },
        gradeNotifications: { type: Boolean, default: true },
        announcements: { type: Boolean, default: true },
        marketingEmails: { type: Boolean, default: false }
    },
    profileImage: {
        type: String,
        default: 'https://via.placeholder.com/150', // Valid default image URL
        validate: {
            validator: v => {
                // Allow empty string or valid URL
                if (v === "") return true;
                return /^(https?:\/\/).+\.(jpg|jpeg|png|gif)(\?.*)?$/i.test(v);
            },
            message: "Invalid image URL format. Must start with http/https and end with image extension"
        }
    },
    coursesTaught: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    refreshToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.refreshToken;
            return ret;
        }
    }
});

// Safe Index Configuration


// Password Hashing Middleware
UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(new Error("Password hashing failed: " + error.message));
    }
});

// Instructor Sync Handling
const handleInstructorSync = async (doc, operation) => {
    try {
        if (doc.role === "instructor" || operation === "delete") {
            await syncInstructor({
                userId: doc._id,
                email: doc.email,
                firstName: doc.firstName,
                lastName: doc.lastName,
                operation
            });
        }
    } catch (error) {
        console.error(`Instructor sync error (${operation}):`, error);
    }
};

UserSchema.post("save", async function(doc) {
    if (this.isModified("role") || this.isModified("email")) {
        await handleInstructorSync(doc, "update");
    }
});

UserSchema.post("findOneAndUpdate", async function(doc) {
    if (doc && (doc.isModified("role") || doc.isModified("email"))) {
        await handleInstructorSync(doc, "update");
    }
});

UserSchema.post("findOneAndDelete", async function(doc) {
    if (doc) await handleInstructorSync(doc, "delete");
});

export default mongoose.model("User", UserSchema);