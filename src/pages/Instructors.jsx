import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, BookOpen, Star, Users, Search, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
// import { Badge } from "@/components/ui/badge";

const Instructors = () => {
  const { currentUser } = useAuth();
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get('/api/instructors');
        setInstructors(response.data);
        setFilteredInstructors(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = instructors.filter(instructor =>
          instructor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructor.coursesTaught.some(course =>
              course.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredInstructors(filtered);
    } else {
      setFilteredInstructors(instructors);
    }
  }, [searchTerm, instructors]);

  const handleContact = (instructorId) => {
    // Implement contact functionality
    console.log("Contact instructor:", instructorId);
  };

  if (loading) {
    return (
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="ml-64 flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <p>Loading instructors...</p>
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Instructors</h1>
              <p className="text-gray-600">Meet our team of experienced instructors and experts</p>

              <div className="mt-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                      placeholder="Search instructors or courses..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstructors.length > 0 ? (
                  filteredInstructors.map((instructor) => (
                      <div key={instructor._id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6 text-center">
                          <div className="relative w-24 h-24 mx-auto mb-4">
                            <img
                                src={instructor.profileImage || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"}
                                alt={instructor.fullName}
                                className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                            />
                            <Badge className="absolute -bottom-1 -right-1 bg-blue-600 text-white px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 mr-1" />
                              {instructor.rating?.toFixed(1) || "4.8"}
                            </Badge>
                          </div>

                          <h3 className="text-xl font-semibold text-gray-800">{instructor.fullName}</h3>
                          <p className="text-blue-600 font-medium text-sm mb-1">
                            {instructor.coursesTaught.length > 0
                                ? instructor.coursesTaught[0].title
                                : "Instructor"}
                          </p>

                          <div className="flex justify-center gap-2 my-3 flex-wrap">
                            {instructor.coursesTaught.slice(0, 3).map(course => (
                                <Badge
                                    key={course._id}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                  {course.title}
                                </Badge>
                            ))}
                            {instructor.coursesTaught.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{instructor.coursesTaught.length - 3} more
                                </Badge>
                            )}
                          </div>

                          <div className="mt-4 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleContact(instructor._id)}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                            {currentUser?.role === 'student' && (
                                <Button className="flex-1">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Enroll
                                </Button>
                            )}
                          </div>
                        </div>
                      </div>
                  ))
              ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No instructors found matching your search</p>
                  </div>
              )}
            </div>
          </main>
        </div>
      </div>
  );
};

export default Instructors;