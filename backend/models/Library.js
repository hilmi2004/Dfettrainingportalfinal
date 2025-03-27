import mongoose from "mongoose";

const LibrarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    fileUrl: { type: String, required: true }, // URL to download/view the book
    createdAt: { type: Date, default: Date.now },
});

const Library = mongoose.model("Library", LibrarySchema);

// Function to add a book to the library
const addBook = async () => {
    try {
        const book = await Library.create({
            title: "Introduction to JavaScript",
            author: "John Doe",
            category: "Programming",
            fileUrl: "https://example.com/intro-to-js.pdf",
        });
        console.log("Book added successfully:", book);
    } catch (error) {
        console.error("Error adding book:", error);
    }
};

// Call function for testing (remove in production)
addBook();

export { Library };
