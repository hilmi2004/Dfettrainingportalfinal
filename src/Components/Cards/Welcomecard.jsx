import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import {Cookies} from "js-cookies";

const WelcomeCard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                // WelcomeCard.jsx
                const response = await axios.get(
                    "http://localhost:2000/api/auth/me", // Updated endpoint
                    {
                        withCredentials: true,
                        validateStatus: (status) => status < 500
                    }
                );

                if (response.status === 401) {
                    setError("Session expired - Please login again");
                    return;
                }

                console.log("User data:", response.data);
                setUser(response.data);
            } catch (err) {
                console.error("Full error:", err.response || err);
                setError(err.response?.data?.message || "Authentication failed");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Get current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);

    if (loading) {
        return (
            <div className="bg-white shadow-md rounded-lg p-6 animate-fade-in">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white shadow-md rounded-lg p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h2>
                <p className="text-gray-700">{error}</p>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Side - Greeting & Date */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                        Welcome back, {user ? user.firstName : "User"}!
                    </h2>
                    <div className="flex items-center text-gray-500">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span className="text-sm">{dateString}</span>
                    </div>
                    <p className="mt-3 text-gray-600">
                        Continue learning where you left off or explore new courses.
                    </p>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium w-full sm:w-auto hover:bg-blue-700 transition">
                        Continue Learning
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium w-full sm:w-auto hover:bg-gray-300 transition">
                        Browse Courses
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeCard;