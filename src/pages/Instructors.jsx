
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Mail, BookOpen, Star, Users } from "lucide-react";

const instructors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    position: "Professor of Computer Science",
    department: "Computer Science",
    courses: 12,
    students: 2450,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    position: "Head of Data Science",
    department: "Computer Science",
    courses: 8,
    students: 1890,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 3,
    name: "Dr. Emma Williams",
    position: "Professor of Business",
    department: "Business Studies",
    courses: 10,
    students: 2100,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 4,
    name: "Alex Thompson",
    position: "Senior Lecturer in Design",
    department: "Design",
    courses: 6,
    students: 1450,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 5,
    name: "Prof. David Lee",
    position: "Professor of Mathematics",
    department: "Mathematics",
    courses: 9,
    students: 1700,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 6,
    name: "Maria Rodriguez",
    position: "Language Instructor",
    department: "Languages",
    courses: 7,
    students: 2300,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", 
  },
];

const Instructors = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 page-transition">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Instructors</h1>
            <p className="text-gray-600">Meet our team of experienced instructors and experts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="app-card card-hover">
                <div className="p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-teach-blue-500 text-white p-1 rounded-full">
                      <Star className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800">{instructor.name}</h3>
                  <p className="text-teach-blue-600 font-medium text-sm mb-1">{instructor.position}</p>
                  <p className="text-gray-500 text-sm mb-4">{instructor.department}</p>
                  
                  <div className="flex justify-center gap-4 py-3 border-t border-b border-gray-100 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-800">{instructor.courses}</p>
                      <p className="text-xs text-gray-500">Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-800">{instructor.students.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-800">{instructor.rating}</p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="btn-primary flex-1 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Courses
                    </button>
                    <button className="btn-secondary flex-1 flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Instructors;
