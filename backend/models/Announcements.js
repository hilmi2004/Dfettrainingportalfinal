import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

const Announcement = mongoose.model("Announcement", AnnouncementSchema);

// Function to create an announcement
const createAnnouncement = async () => {
    try {
        const announcement = await Announcement.create({
            title: "New Course Available!",
            content: "We have just launched a new programming course. Enroll now!",
            author: "5f81c3e8b2823248d2509326", // Ensure valid user ObjectId
        });
        console.log("Announcement created successfully:", announcement);
    } catch (error) {
        console.error("Error creating announcement:", error);
    }
};

// Call function for testing (remove in production)
createAnnouncement();

export { Announcement };
