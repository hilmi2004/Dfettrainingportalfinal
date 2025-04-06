import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Clock, BookOpen, Users, ChevronDown, CheckCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

// Course configuration
const COURSE_CONFIG = {
  categories: [
    "All Courses",
    "Web Development",
    "App Development",
    "Crypto Classes",
    "UI/UX"
  ],
  prices: {
    "Web Development": 50000,
    "App Development": 60000,
    "Crypto Classes": 70000,
    "UI/UX": 40000
  },
  durationMultipliers: {
    "3 months": 1,
    "6 months": 1.8,
    "12 months": 3,
  },
  modeMultipliers: {
    "Online": 1,
    "Physical": 1.2
  }
};

const CourseCard = ({
                      title,
                      image,
                      durations,
                      teachingModes,
                      lessons,
                      onEnroll,
                      isEnrolling,
                    }) => {
  const [selectedDuration, setSelectedDuration] = useState(durations[0]);
  const [selectedMode, setSelectedMode] = useState(teachingModes[0]);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    const basePrice = COURSE_CONFIG.prices[title] || 0;
    const durationMult = COURSE_CONFIG.durationMultipliers[selectedDuration] || 1;
    const modeMult = COURSE_CONFIG.modeMultipliers[selectedMode] || 1;
    setCalculatedPrice(Math.round(basePrice * durationMult * modeMult));
  }, [selectedDuration, selectedMode, title]);

  return (
      <div className="app-card card-hover overflow-hidden flex flex-col border border-gray-200 rounded-lg shadow-sm">
        <div className="relative h-48">
          <img
              src={image || "/course-placeholder.jpg"}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-blue-600">
            {selectedDuration}
          </span>
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-blue-600">
            ₦{calculatedPrice.toLocaleString()}
          </span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{title}</h3>

          <div className="flex gap-2 my-3">
            <div className="relative flex-1">
              <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isEnrolling}
              >
                {durations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
              {/*<ChevronDown className="absolute right-2 top-2 w-4 h-4 text-gray-500 pointer-events-none" />*/}
            </div>

            <div className="relative flex-1">
              <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isEnrolling}
              >
                {teachingModes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
              {/*<ChevronDown className="absolute right-2 top-2 w-4 h-4 text-gray-500 pointer-events-none" />*/}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              <span>{lessons} Lessons</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{selectedMode} Mode</span>
            </div>
          </div>

          <button
              onClick={() => onEnroll(title, selectedDuration, selectedMode, calculatedPrice)}
              disabled={isEnrolling}
              className={`btn-primary w-full mt-auto flex items-center justify-center ${
                  isEnrolling ? "opacity-75 cursor-not-allowed" : ""
              }`}
          >
            {isEnrolling ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
            ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Enroll Now - ₦{calculatedPrice.toLocaleString()}
                </>
            )}
          </button>
        </div>
      </div>
  );
};

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [enrolling, setEnrolling] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const groupCourses = (courses) => {
    return courses.reduce((acc, course) => {
      const key = course.title;
      if (!acc[key]) {
        acc[key] = {
          title: course.title,
          image: course.image,
          durations: [],
          teachingModes: [],
          lessons: course.lessons?.length || 0,
          variants: [],
          isEnrolled: enrolledCourses.some(ec => ec._id === course._id)
        };
      }

      if (!acc[key].durations.includes(course.duration)) {
        acc[key].durations.push(course.duration);
      }
      if (!acc[key].teachingModes.includes(course.teachingMode)) {
        acc[key].teachingModes.push(course.teachingMode);
      }
      acc[key].variants.push(course);

      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, userRes] = await Promise.all([
          axios.get("http://localhost:2000/api/courses"),
          axios.get("http://localhost:2000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })
        ]);

        setCourses(coursesRes.data);
        setEnrolledCourses(userRes.data.enrolledCourses || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (courseTitle, duration, mode, price) => {
    try {
      setEnrolling(true);

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const courseGroup = groupCourses(courses)[courseTitle];
      const courseToEnroll = courseGroup?.variants.find(v =>
          v.duration === duration && v.teachingMode === mode
      );

      if (!courseToEnroll) {
        toast.error("Course configuration not available");
        return;
      }

      if (courseGroup.isEnrolled) {
        toast.info("You're already enrolled in this course");
        return;
      }

      const response = await axios.post(
          "http://localhost:2000/api/courses/enroll",
          { courseId: courseToEnroll._id },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Enrolled in ${courseTitle} (${duration}, ${mode})`);
        // Update enrolled courses
        const userRes = await axios.get("http://localhost:2000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrolledCourses(userRes.data.enrolledCourses || []);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.warning("You're already enrolled in this course");
      } else {
        toast.error(error.response?.data?.message || "Enrollment failed");
      }
    } finally {
      setEnrolling(false);
    }
  };

  const filteredCourses = selectedCategory === "All Courses"
      ? courses
      : courses.filter(course => course.title === selectedCategory);

  if (loading) {
    return (
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="ml-64 flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 page-transition">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </main>
          </div>
        </div>
    );
  }

  return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64 flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6 page-transition">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Courses</h1>
              <p className="text-gray-600">Choose from our professionally designed programs</p>
            </div>

            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-2 min-w-max pb-2">
                {COURSE_CONFIG.categories.map((category) => (
                    <button
                        key={category}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === category
                                ? "bg-blue-500 text-white shadow-md"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                ))}
              </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="app-card p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No courses available in this category
                  </h3>
                  <p className="text-gray-500 mb-4">
                    We're currently working on adding more courses. Please check back later.
                  </p>
                  <button
                      onClick={() => setSelectedCategory("All Courses")}
                      className="btn-primary inline-flex items-center"
                  >
                    View All Courses
                  </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.values(groupCourses(filteredCourses)).map(group => (
                      <CourseCard
                          key={group.title}
                          title={group.title}
                          image={group.image}
                          durations={group.durations}
                          teachingModes={group.teachingModes}
                          lessons={group.lessons}
                          onEnroll={handleEnroll}
                          isEnrolling={enrolling && group.title === enrolling}
                      />
                  ))}
                </div>
            )}
          </main>
        </div>
      </div>
  );
};

export default Courses;