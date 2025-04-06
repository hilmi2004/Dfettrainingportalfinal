import mongoose from "mongoose";

const LibrarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ["Web Development", "App Development", "Crypto Classes", "UI/UX"]
    },
    fileUrl: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ["E-Book", "Video Tutorial", "Academic Paper", "Course Material"]
    },
    fileSize: { type: String },
    image: { type: String },
    downloadCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Library = mongoose.model("Library", LibrarySchema);

export { Library };