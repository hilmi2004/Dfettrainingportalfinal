import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Welcomecard from "@/Components/Cards/Welcomecard.jsx";
import CourseCard from "@/components/Cards/CourseCard";
import AnnouncementCard from "@/components/Cards/AnnouncementCard";
import { CalendarDays, GraduationCap, BarChart3, CheckCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const announcements = [
    {
        id: 1,
        title: "New Learning Platform Update",
        content: "We've updated our learning platform with new features to enhance your experience.",
        date: "2023-05-15",
        important: true
    },
    {
        id: 2,
        title: "Upcoming Web Development Workshop",
        content: "Join our free workshop on advanced React techniques next Friday.",
        date: "2023-05-10",
        important: false
    },
    {
        id: 3,
        title: "Maintenance Scheduled",
        content: "The platform will be unavailable this Sunday from 2-4 AM for maintenance.",
        date: "2023-05-05",
        important: false
    }
];

const Dashboard = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Please login to access courses");
                    return;
                }

                const userResponse = await axios.get("http://localhost:2000/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(err => {
                    if (err.response?.status === 401) {
                        localStorage.removeItem("token");
                        window.location.href = '/login';
                    }
                    throw err;
                });

                const userId = userResponse.data.user?.id;
                if (!userId) {
                    throw new Error("User data incomplete");
                }

                const coursesResponse = await axios.get(
                    `http://localhost:2000/api/users/${userId}/courses`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setEnrolledCourses(coursesResponse.data || []);
            } catch (error) {
                console.error("API Error:", error.response?.data || error.message);
                toast.error(error.response?.data?.message || "Failed to load courses");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [refreshTrigger]);

    const transformCourseData = (enrollment) => {
        // Handle cases where course data might be in different fields
        const course = enrollment.course || enrollment.buffer || {};

        // Validate required fields
        if (!course._id || !course.title) {
            console.warn("Incomplete course data:", enrollment);
            return null;
        }

        // Calculate progress
        const enrollmentDate = new Date(enrollment.enrollmentDate || course.createdAt || Date.now());
        const durationMonths = parseInt((course.duration || "3 months").split(' ')[0]) || 3;
        const endDate = new Date(enrollmentDate);
        endDate.setMonth(enrollmentDate.getMonth() + durationMonths);

        const now = new Date();
        let progress = 0;

        if (now >= endDate) {
            progress = 100;
        } else if (now > enrollmentDate) {
            progress = Math.round(((now - enrollmentDate) / (endDate - enrollmentDate)) * 100);
        }

        return {
            id: course._id,
            title: course.title,
            instructor: formatInstructor(course.instructor),
            progress: Math.min(100, Math.max(0, progress)),
            duration: course.duration || "3 months",
            lessons: course.lessons?.length || 0,
            image: course.image || getDefaultCourseImage(course.title),
            startDate: enrollmentDate,
            expectedEndDate: endDate,
            isCompleted: progress >= 100
        };
    };

    const formatInstructor = (instructor) => {
        if (!instructor) return "Instructor not assigned";
        if (typeof instructor === "string") return instructor;
        return `Prof. ${instructor.firstName || ""} ${instructor.lastName || ""}`.trim();
    };

    const getDefaultCourseImage = (title) => {
        const images = {
            "Web Development": "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8",
            "App Development": "https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7",
            "Crypto Classes": "https://images.unsplash.com/photo-1629877521896-4719f02df3c7",
            "UI/UX": "https://images.unsplash.com/photo-1621111848501-8d3634f82336"
        };
        return images[title] || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0";
    };

    const refreshData = () => setRefreshTrigger(prev => !prev);

    // Filter out null courses before rendering
    const validCourses = enrolledCourses
        .map(transformCourseData)
        .filter(course => course !== null);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="ml-64 flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6 page-transition">
                    <Welcomecard refresh={refreshData} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        {/* Left Column - Courses and Announcements */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Enrolled Courses Section */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Enrolled Courses</h2>
                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : validCourses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {validCourses.map((course) => (
                                            <CourseCard
                                                key={course.id}
                                                {...course}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="app-card p-6 text-center">
                                        <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                                        <button
                                            className="btn-primary"
                                            onClick={() => window.location.href = '/courses'}
                                        >
                                            Browse Available Courses
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Announcements Section */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Announcements</h2>
                                <div className="space-y-4">
                                    {announcements.map((announcement) => (
                                        <AnnouncementCard
                                            key={announcement.id}
                                            title={announcement.title}
                                            content={announcement.content}
                                            date={announcement.date}
                                            important={announcement.important}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Stats and Quick Links */}
                        <div className="space-y-6">
                            {/* Progress Summary */}
                            <div className="app-card p-6">
                                <h3 className="font-semibold text-lg mb-4">Your Learning Progress</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Courses in Progress</p>
                                            <p className="font-medium">
                                                {validCourses.filter(c => c.progress > 0 && c.progress < 100).length}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Courses Completed</p>
                                            <p className="font-medium">
                                                {validCourses.filter(c => c.isCompleted).length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Events */}
                            <div className="app-card p-6">
                                <h3 className="font-semibold text-lg mb-4">Upcoming Events</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
                                            <CalendarDays className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Web Development Workshop</p>
                                            <p className="text-sm text-gray-500">Tomorrow, 2:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-1">
                                            <GraduationCap className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Monthly Progress Review</p>
                                            <p className="text-sm text-gray-500">Next Monday, 10:00 AM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="app-card p-6">
                                <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="btn-secondary py-2 text-sm">
                                        Submit Assignment
                                    </button>
                                    <button className="btn-secondary py-2 text-sm">
                                        Request Support
                                    </button>
                                    <button className="btn-secondary py-2 text-sm">
                                        View Certificates
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;