// middlewares/instructorSync.js
import { Instructor } from "../models/Instructor.js";
import User from "../models/User.js";

export const syncInstructor = async (userId, action) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        if (action === 'create' && user.role === 'instructor') {
            // Check if instructor record already exists
            const existingInstructor = await Instructor.findOne({ userId });
            if (!existingInstructor) {
                await Instructor.create({
                    userId,
                    fullName: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    coursesTaught: []
                });
            }
        } else if (action === 'update') {
            if (user.role === 'instructor') {
                await Instructor.findOneAndUpdate(
                    { userId },
                    {
                        fullName: `${user.firstName} ${user.lastName}`,
                        email: user.email
                    },
                    { upsert: true, new: true }
                );
            } else {
                // If user is no longer an instructor, remove from Instructor collection
                await Instructor.findOneAndDelete({ userId });
            }
        } else if (action === 'delete') {
            await Instructor.findOneAndDelete({ userId });
        }
    } catch (error) {
        console.error("Error syncing instructor:", error);
    }
};