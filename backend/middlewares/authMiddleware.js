import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// authMiddleware.js
const authMiddleware = (req, res, next) => {
    let token;

    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    // Fallback to cookie if no header
    else {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No authentication token found"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Error:", err.message);
            return res.status(401).json({
                success: false,
                message: "Invalid/expired token",
                error: err.message
            });
        }

        req.user = decoded;
        // Add after req.user = decoded
        if (req.originalUrl.startsWith("/api/admin") && req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        console.log("Authenticated User:", decoded);
        next();
    });
};

export default authMiddleware;