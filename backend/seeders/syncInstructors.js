// scripts/syncInstructors.js
import mongoose from "mongoose";
import User from "../models/User.js";
import { syncInstructor } from "../middlewares/instructorSync.js";

async function runMigration() {
    await mongoose.connect(process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/dfetusers" );

    const instructors = await User.find({ role: 'instructor' });
    for (const user of instructors) {
        await syncInstructor(user._id, 'create');
        console.log(`Synced instructor: ${user.firstName} ${user.lastName}`);
    }

    console.log("Migration complete");
    process.exit(0);
}

runMigration().catch(console.error);