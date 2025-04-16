import jwt from 'jsonwebtoken';
import {cookieOptions} from "../config/cookies.js";

export const authMiddleware = (req, res, next) => {
    try {
        // Get token from cookies first
        const token = req.cookies.accessToken ||
            req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authorization required"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        console.error('Auth Error:', error.message);

        // Clear invalid cookies
        // Replace res.clearCookies() with:
        res.clearCookie('accessToken', cookieOptions)
            .clearCookie('refreshToken', cookieOptions);

        return res.status(401).json({
            success: false,
            message: error.name === 'TokenExpiredError'
                ? "Session expired"
                : "Invalid authentication"
        });
    }
};