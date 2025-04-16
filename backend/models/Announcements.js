import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    important: { type: Boolean, default: false },
});

const Announcement = mongoose.model("Announcement", AnnouncementSchema);



export default Announcement;
