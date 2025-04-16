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


// Call function for testing (remove in production)


export { Inbox };
