import mongoose from 'mongoose';
import { Library } from '../models/Library.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = [
    {
        title: "Modern Web Development",
        author: "Sarah Johnson",
        category: "Web Development",
        fileUrl: "https://example.com/web-dev.pdf",
        type: "E-Book",
        fileSize: "5.2 MB",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D"
    },
    {
        title: "React Masterclass",
        author: "Alex Chen",
        category: "Web Development",
        fileUrl: "https://example.com/react-masterclass.pdf",
        type: "E-Book",
        fileSize: "3.8 MB",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhY3QlMjBqc3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        title: "Mobile App Design Patterns",
        author: "Emma Williams",
        category: "App Development",
        fileUrl: "https://example.com/app-design.pdf",
        type: "E-Book",
        fileSize: "4.5 MB",
        image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9iaWxlJTIwYXBwfGVufDB8fDB8fHww"
    },
    {
        title: "Blockchain Fundamentals",
        author: "Michael Brown",
        category: "Crypto Classes",
        fileUrl: "https://example.com/blockchain-fundamentals.pdf",
        type: "E-Book",
        fileSize: "6.1 MB",
        image: "https://images.unsplash.com/photo-1626624340247-9e5fef6f7f0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvY2tjaGFpbnxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        title: "UI/UX Design Principles",
        author: "David Kim",
        category: "UI/UX",
        fileUrl: "https://example.com/ui-ux-principles.pdf",
        type: "E-Book",
        fileSize: "4.2 MB",
        image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dWklMjB1eHxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        title: "Advanced JavaScript Patterns",
        author: "Sarah Johnson",
        category: "Web Development",
        fileUrl: "https://example.com/js-patterns.pdf",
        type: "Video Tutorial",
        fileSize: "245 MB",
        image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amF2YXNjcmlwdHxlbnwwfHwwfHx8MA%3D%3D"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/dfetusers");
        await Library.deleteMany({});
        await Library.insertMany(seedData);
        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();