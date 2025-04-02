import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash } from "lucide-react";

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "3 months",
        teachingMode: "Online",
        price: 0,
        image: ""
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const res = await axios.get("http://localhost:2000/api/courses");
        setCourses(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("/api/admin/courses", formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        fetchCourses();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>

            {/* Create Course Form */}
            <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
                <input
                    type="text"
                    placeholder="Course Title"
                    className="block w-full mb-2 p-2 border rounded"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {/* Add other fields similarly */}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    <Plus size={16} className="inline mr-2" />
                    Add Course
                </button>
            </form>

            {/* Courses List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                    <div key={course._id} className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <p>{course.description}</p>
                        <div className="mt-4 flex gap-2">
                            <button className="bg-yellow-500 text-white p-2 rounded">
                                <Edit size={16} />
                            </button>
                            <button className="bg-red-500 text-white p-2 rounded">
                                <Trash size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCourses;