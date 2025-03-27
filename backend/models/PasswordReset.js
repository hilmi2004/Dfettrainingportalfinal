import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);

// Function to generate a password reset token
const createPasswordReset = async () => {
    try {
        const resetToken = await PasswordReset.create({
            user: "5f81c3e8b2823248d2509326", // Ensure valid user ObjectId
            token: "random-generated-token",
            expiresAt: new Date(Date.now() + 3600000), // Token expires in 1 hour
        });
        console.log("Password reset token created successfully:", resetToken);
    } catch (error) {
        console.error("Error creating password reset token:", error);
    }
};

// Call function for testing (remove in production)
createPasswordReset();

export { PasswordReset };
