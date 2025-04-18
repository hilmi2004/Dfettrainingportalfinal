import express from "express";
import {
    loginUser,
    refreshToken,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword
} from "../controllers/authControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Corrected routes
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", authMiddleware, logoutUser);
router.get("/me", authMiddleware, getCurrentUser); // Fixed closing quote
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;