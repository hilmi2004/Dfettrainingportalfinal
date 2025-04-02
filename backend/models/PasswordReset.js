import mongoose from "mongoose";
import crypto from "crypto";

const PasswordResetSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
});

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);

export const createPasswordReset = async (email) => {
    try {
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000);

        await PasswordReset.deleteOne({ email });

        await PasswordReset.create({ email, token: resetToken, expiresAt });

        console.log("✅ Password reset token created:", resetToken);
        return resetToken;
    } catch (error) {
        console.error("❌ Error creating password reset token:", error);
        throw new Error("Failed to generate reset token");
    }
};

// Export the model and function separately
export default PasswordReset;
