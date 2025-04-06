import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const migrateEnrollments = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not defined in .env file");
        }

        console.log("Connecting to database...");
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
        });
        console.log("Database connected successfully");

        // Diagnostic query to check the situation
        const totalUsers = await User.countDocuments({});
        const usersWithEnrollments = await User.countDocuments({
            "enrolledCourses": { $exists: true, $not: { $size: 0 } }
        });
        const usersNeedingUpdate = await User.countDocuments({
            "enrolledCourses.enrollmentDate": { $exists: false }
        });

        console.log(`
      Database stats:
      - Total users: ${totalUsers}
      - Users with enrollments: ${usersWithEnrollments}
      - Users needing updates: ${usersNeedingUpdate}
    `);

        if (usersNeedingUpdate === 0) {
            console.log("No users need migration - all enrollments have dates already");
            process.exit(0);
        }

        // Process in batches for better performance
        const BATCH_SIZE = 100;
        let lastId = null;
        let updatedCount = 0;
        let processedCount = 0;

        do {
            const query = lastId
                ? {
                    _id: { $gt: lastId },
                    "enrolledCourses.enrollmentDate": { $exists: false }
                }
                : { "enrolledCourses.enrollmentDate": { $exists: false } };

            const users = await User.find(query)
                .sort({ _id: 1 })
                .limit(BATCH_SIZE);

            if (users.length === 0) break;

            for (const user of users) {
                const updatedEnrollments = user.enrolledCourses.map(enrollment => {
                    return {
                        ...enrollment.toObject(),
                        enrollmentDate: enrollment.enrollmentDate || new Date()
                    };
                });

                user.enrolledCourses = updatedEnrollments;
                await user.save();
                updatedCount++;
                lastId = user._id;
            }

            processedCount += users.length;
            console.log(`Processed ${processedCount} users, updated ${updatedCount} enrollments...`);
        } while (true);

        console.log(`Migration complete. Updated ${updatedCount} enrollments across ${processedCount} users`);
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

migrateEnrollments();