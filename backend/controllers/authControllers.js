import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import { cookieOptions } from "../config/cookies.js";
import mongoose from "mongoose";

// 🚀 Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validation
        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user with case-insensitive email
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        }).select('+password +refreshToken');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Password verification
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Update user with new refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Set cookies
        // In loginUser controller, modify response:

        if (process.env.NODE_ENV === 'development') {
            console.log("✅ Cookies set:", accessToken.length, refreshToken.length);
            console.log('Cookies set:', res.getHeaders()['set-cookie']);
        }

        res
            .cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000 // 15 min
            })
            .cookie("refreshToken", refreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .json({
                success: true,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    profileImage: user.profileImage
                }
            });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// 🚀 Refresh Token
// 🚀 Refresh Token - Modified with security enhancements
export const refreshToken = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        if (!oldRefreshToken) {
            return res.status(401).json({ success: false, message: "No refresh token" });
        }

        // Start a single session for the entire transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

            const user = await User.findOne({
                _id: decoded.id,
                refreshToken: oldRefreshToken
            }).select('+refreshToken').session(session);

            if (!user) {
                await session.abortTransaction();
                res.clearCookie('accessToken', cookieOptions)
                    .clearCookie('refreshToken', cookieOptions);
                return res.status(401).json({ success: false, message: "Invalid refresh token" });
            }

            // Generate new tokens
            const newAccessToken = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            const newRefreshToken = jwt.sign(
                { id: user._id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            // Update user with new refresh token
            user.refreshToken = newRefreshToken;
            await user.save({ session });

            // Set cookies
            res.cookie("accessToken", newAccessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000 // 15 min
            })
                .cookie("refreshToken", newRefreshToken, {
                    ...cookieOptions,
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });

            await session.commitTransaction();
            return res.json({ success: true });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }

    } catch (error) {
        console.error('Refresh token error:', error);
        res.clearCookie('accessToken', cookieOptions)
            .clearCookie('refreshToken', cookieOptions)
            .status(401).json({ success: false, message: error.message });
    }
};
// 🚀 Logout User
export const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
        res.clearCookie('accessToken', cookieOptions)
            .clearCookie('refreshToken', cookieOptions);
        res.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false });
    }
};
// 🚀 Get Current User
// 🚀 Get Current User - Ensure proper implementation
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password -refreshToken")
            .populate({
                path: 'enrolledCourses.course',
                select: 'title description instructor duration teachingMode price image lessons'
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                enrolledCourses: user.enrolledCourses,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// 🚀 Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 3600000; // 1 hour

        await PasswordReset.create({
            email: user.email,
            token: resetToken,
            expiresAt
        });

        // In production: Send email with reset link
        console.log(`Password reset link: http://localhost:5173/reset-password/${resetToken}`);

        res.json({
            success: true,
            message: "Reset link sent to email"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// 🚀 Reset Password
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const resetRequest = await PasswordReset.findOne({ token });
        if (!resetRequest || resetRequest.expiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        const user = await User.findOne({ email: resetRequest.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Delete reset token
        await PasswordReset.deleteOne({ token });

        res.json({
            success: true,
            message: "Password reset successful"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

