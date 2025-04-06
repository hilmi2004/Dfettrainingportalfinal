// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";

// 🚀 Login User (Now returns user data & token)
// export const loginUser = async (req, res) => {
//     const { email, password } = req.body;
//
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ success: false, message: "Invalid email or password." });
//         }
//
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ success: false, message: "Invalid email or password." });
//         }
//
//         // Generate JWT token
//         const token = jwt.sign(
//             { id: user._id, email: user.email },
//             "your_secret_key", // Replace with your actual secret key
//             { expiresIn: "1h" }
//         );
//
//         // Send user details with token
//         res.json({
//             success: true,
//             message: "Login successful.",
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email
//             },
//             token
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server error." });
//     }
// };


// 🚀 Request Password Reset (Sends token via email)
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

        await PasswordReset.create({ email, token, expiresAt });

        // Normally, send email here
        console.log(`Password reset link: http://localhost:5173/reset-password/${token}`);

        res.json({ success: true, message: "Password reset link sent to email." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
        console.error(error);
    }
};

// 🚀 Reset Password
export const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        const resetRequest = await PasswordReset.findOne({ token });

        if (!resetRequest || resetRequest.expiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        }

        const user = await User.findOne({ email: resetRequest.email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        await PasswordReset.deleteOne({ token });

        res.json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
        console.error(error);
    }
};

// 🚀 Login User (Now returns user data & token)
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import User from "../models/User.js";
// import PasswordReset from "../models/PasswordReset.js";

// 🚀 Login User (Now returns user data & token)
// export const loginUser = async (req, res) => {
//     const { email, password } = req.body;
//
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ success: false, message: "Invalid email or password." });
//         }
//
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ success: false, message: "Invalid email or password." });
//         }
//
//         // Generate JWT token
//         const token = jwt.sign(
//             { id: user._id, email: user.email },
//             "your_secret_key", // Replace with your actual secret key
//             { expiresIn: "1h" }
//         );
//
//         // Send user details with token
//         res.json({
//             success: true,
//             message: "Login successful.",
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email
//             },
//             token
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server error." });
//     }
// };


// 🚀 Request Password Reset (Sends token via email)
// export const forgotPassword = async (req, res) => {
//     const { email } = req.body;
//
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found." });
//         }
//
//         const token = crypto.randomBytes(32).toString("hex");
//         const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
//
//         await PasswordReset.create({ email, token, expiresAt });
//
//         // Normally, send email here
//         console.log(`Password reset link: http://localhost:5173/reset-password/${token}`);
//
//         res.json({ success: true, message: "Password reset link sent to email." });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Server error." });
//         console.error(error);
//     }
// };

// 🚀 Reset Password
// export const resetPassword = async (req, res) => {
//     const { password } = req.body;
//     const { token } = req.params;
//
//     try {
//         const resetRequest = await PasswordReset.findOne({ token });
//
//         if (!resetRequest || resetRequest.expiresAt < Date.now()) {
//             return res.status(400).json({ success: false, message: "Invalid or expired token." });
//         }
//
//         const user = await User.findOne({ email: resetRequest.email });
//
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found." });
//         }
//
//         user.password = await bcrypt.hash(password, 10);
//         await user.save();
//
//         await PasswordReset.deleteOne({ token });
//
//         res.json({ success: true, message: "Password reset successfully." });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Server error." });
//         console.error(error);
//     }
// };

// 🚀 Login User (Now returns user data & token)
// 🚀 Login User (Now returns user data & token)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate JWT token with all required user data
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                role: user.role  // Fixed: Added missing comma after firstName
            },
            process.env.JWT_SECRET || "khavkbrvu84oih8i5h294h2f2yf8h2842hf",
            { expiresIn: "1h" }
        );

        // Set cookie and return response
        res
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 3600000 // 1 hour in milliseconds
            })
            .json({
                success: true,
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};