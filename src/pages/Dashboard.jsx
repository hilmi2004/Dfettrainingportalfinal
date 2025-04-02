import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Welcomecard from "@/Components/Cards/Welcomecard.jsx";
import CourseCard from "@/components/Cards/CourseCard";
import AnnouncementCard from "@/components/Cards/AnnouncementCard";
import GradesChart from "@/components/Cards/GradesChart";
import PointsDisplay from "@/components/Cards/PointsDisplay";
import { CalendarDays, GraduationCap, BarChart3 } from "lucide-react";
import axios from "axios";

const announcements = [
    // ... keep existing announcements array
];

const Index = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    // Single useEffect for data fetching
    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const userResponse = await axios.get("http://localhost:2000/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const coursesResponse = await axios.get(
                    `http://localhost:2000/api/auth/users/${userResponse.data._id}/courses`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Remove duplicates using Set
                const uniqueCourses = coursesResponse.data.filter(
                    (course, index, self) =>
                        self.findIndex(c => c._id === course._id) === index
                );

                setEnrolledCourses(uniqueCourses);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [refreshTrigger]);


    const transformCourseData = (course) => ({
        id: course._id,
        title: course.title,
        instructor: course.instructor?
            `Prof. ${course.instructor.firstName} ${course.instructor.lastName}` :
            "Instructor not assigned",
        progress: calculateCourseProgress(course),
        duration: course.duration,
        lessons: course.lessons?.length || 0,
        image: course.image || getCourseImage(course.title)
    });

    const calculateCourseProgress = (course) => {
        if (!course.completedLessons || !course.lessons) return 0;
        const completed = course.completedLessons.length;
        const total = course.lessons.length;
        return Math.round((completed / (total || 1)) * 100); // Prevent division by zero
    };

    const getCourseImage = (title) => {
        const courseImages = {
            "Web Development": "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdlYiUyMGRldmVsb3BtZW50fGVufDB8fDB8fHww",
            // ... keep other image URLs
        };

        return courseImages[title] || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGJ1c2luZXNzfGVufDB8fDB8fHww";
    };

    const refreshData = () => setRefreshTrigger(prev => !prev);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="ml-64 flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6 page-transition">
                    <Welcomecard refresh={refreshData} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        {/* Enrolled Courses Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Enrolled Courses</h2>
                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : enrolledCourses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {enrolledCourses.map((course) => (
                                            <CourseCard
                                                key={course._id}
                                                {...transformCourseData(course)}
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

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* ... keep existing right sidebar content */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Index;