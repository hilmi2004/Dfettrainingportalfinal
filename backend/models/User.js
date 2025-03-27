import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// Define User Schema
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    course: { type: String, required: true },
    duration: { type: String, required: true },
    teachingMode: { type: String, required: true },
    price: { type: Number, required: true },
    password: { type: String, required: true }, // Store hashed password
    role: { type: String, default: "student" }, // Default role is student
    points: { type: Number, default: 0 }, // Default points to 0
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }] // Reference to Course model
});

// Create User model
const User = mongoose.model("User", UserSchema);

// Function to create a user
// const createUser = async () => {
//     try {
//         const hashedPassword = await bcrypt.hash("password123", 10); // Hash password

        // const user = await User.create({
        //     firstName: "John",
        //     lastName: "Doe",
        //     email: "john.doe@example.com",
        //     phoneNumber: "1234567890",
        //     course: "Web Development",
        //     duration: "3 months",
        //     teachingMode: "Online",
        //     price: 50000,
        //     password: hashedPassword, // Store hashed password
        //     role: "student",
        //     points: 6,
        //     enrolledCourses: [new mongoose.Types.ObjectId('667e4db8fb7ab9f2f7713f62')] // ✅ Exactly 24 characters
// Example valid ObjectId
//         });

//         console.log("User created successfully:", user);
//     } catch (error) {
//         console.error("Error creating user:", error);
//     }
// };

// Export User model and createUser function
export { User };
