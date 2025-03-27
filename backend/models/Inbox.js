import mongoose from "mongoose";

const InboxSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Inbox = mongoose.model("Inbox", InboxSchema);

// Function to send a message
const sendMessage = async () => {
    try {
        const message = await Inbox.create({
            sender: "5f81c3e8b2823248d2509326", // Ensure valid sender ObjectId
            recipient: "5f81c3e8b2823248d2509327", // Ensure valid recipient ObjectId
            subject: "Welcome to the platform",
            message: "Hello, welcome to our learning platform!",
        });
        console.log("Message sent successfully:", message);
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

// Call function for testing (remove in production)
sendMessage();

export { Inbox };
