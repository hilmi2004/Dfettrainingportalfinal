import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, Award, Clock, Calendar, ArrowUp, ArrowDown } from "lucide-react";

const courseGrades = [
  {
    id: 1,
    course: "Web Development",
    instructor: "Dr. Sarah Johnson",
    grade: "A",
    percentage: 92,
    lastUpdated: "May 15, 2023",
    status: "Completed",
  },
  {
    id: 2,
    course: "Data Science Fundamentals",
    instructor: "Prof. Michael Chen",
    grade: "B+",
    percentage: 87,
    lastUpdated: "May 20, 2023",
    status: "In Progress",
  },
  {
    id: 3,
    course: "Business Communication",
    instructor: "Dr. Emma Williams",
    grade: "A-",
    percentage: 90,
    lastUpdated: "May 10, 2023",
    status: "Completed",
  },
  {
    id: 4,
    course: "UX/UI Design Principles",
    instructor: "Alex Thompson",
    grade: "B",
    percentage: 85,
    lastUpdated: "May 18, 2023",
    status: "In Progress",
  },
  {
    id: 5,
    course: "Calculus for Engineers",
    instructor: "Prof. David Lee",
    grade: "C+",
    percentage: 78,
    lastUpdated: "May 12, 2023",
    status: "In Progress",
  },
];

const assignmentGrades = [
  { name: "Assignment 1", grade: 92 },
  { name: "Assignment 2", grade: 88 },
  { name: "Assignment 3", grade: 95 },
  { name: "Midterm", grade: 82 },
  { name: "Assignment 4", grade: 90 },
  { name: "Final Project", grade: 94 },
];

const getGradeColor = (grade) => {
  if (grade.startsWith("A")) return "bg-green-100 text-green-700";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
  if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-700";
  if (grade.startsWith("D")) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
};

const Grades = () => {
  return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="ml-64 flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Grades & Performance</h1>
              <p className="text-gray-600">Monitor your academic progress and performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-5 rounded-lg shadow">
                <div className="flex">
                  <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">GPA</h3>
                    <p className="text-2xl font-bold text-gray-800">3.8</p>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>+0.2 from last semester</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow">
                <div className="flex">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Courses Completed</h3>
                    <p className="text-2xl font-bold text-gray-800">15</p>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>+3 from last semester</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow">
                <div className="flex">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Study Hours</h3>
                    <p className="text-2xl font-bold text-gray-800">168</p>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>+22 from last month</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow">
                <div className="flex">
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Next Exam</h3>
                    <p className="text-2xl font-bold text-gray-800">3 days</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>Data Science Final</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Course Grades</h2>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Course</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Grade</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Percentage</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Last Updated</th>
                      </tr>
                      </thead>
                      <tbody>
                      {courseGrades.map((course) => (
                          <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-gray-800">{course.course}</p>
                                <p className="text-xs text-gray-500">{course.instructor}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(course.grade)}`}>
                              {course.grade}
                            </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div
                                      className="bg-blue-500 h-2 rounded-full"
                                      style={{ width: `${course.percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-700">{course.percentage}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                            <span
                                className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                                    course.status === "Completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                            >
                              {course.status}
                            </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {course.lastUpdated}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Assignment Grades - Web Development</h2>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          data={assignmentGrades}
                          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              border: "none",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            }}
                        />
                        <Bar
                            dataKey="grade"
                            fill="#1A73E8"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                            animationDuration={1000}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Grade Distribution</h2>

                  <div className="space-y-4">
                    {["A", "B", "C", "D", "F"].map((grade, index) => {
                      const count = grade === "A" ? 8 : grade === "B" ? 5 : grade === "C" ? 2 : grade === "D" ? 0 : 0;
                      const percentage = (count / 15) * 100;

                      return (
                          <div key={grade} className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-md flex items-center justify-center font-semibold ${
                                grade === "A" ? "bg-green-100 text-green-700" :
                                    grade === "B" ? "bg-blue-100 text-blue-700" :
                                        grade === "C" ? "bg-yellow-100 text-yellow-700" :
                                            grade === "D" ? "bg-orange-100 text-orange-700" :
                                                "bg-red-100 text-red-700"
                            }`}>
                              {grade}
                            </div>

                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full ${
                                        grade === "A" ? "bg-green-500" :
                                            grade === "B" ? "bg-blue-500" :
                                                grade === "C" ? "bg-yellow-500" :
                                                    grade === "D" ? "bg-orange-500" :
                                                        "bg-red-500"
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>

                            <div className="text-sm font-medium text-gray-700">
                              {count} ({percentage.toFixed(0)}%)
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Assignments</h2>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-800">Data Science Project</h3>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        Due Tomorrow
                      </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Worth 20% of final grade</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Prof. Michael Chen</span>
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-800">UX Design Exercise</h3>
                        <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                        Due in 3 days
                      </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Worth 15% of final grade</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Alex Thompson</span>
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-800">Calculus Problem Set</h3>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        Due in 5 days
                      </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Worth 10% of final grade</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Prof. David Lee</span>
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
  );
};

export default Grades;