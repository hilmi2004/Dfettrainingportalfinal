import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await axios.get('http://localhost:2000/api/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                const coursesRes = await axios.get('http://localhost:2000/api/courses', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                setUsers(usersRes.data);
                setCourses(coursesRes.data);
            } catch (error) {
                console.error('Admin fetch error:', error);
                window.location = '/login';
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Users Section */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Manage Users ({users.length})</h2>
                    <div className="space-y-2">
                        {users.map(user => (
                            <div key={user._id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                                <div>
                                    <p>{user.firstName} {user.lastName}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <span className={`badge ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {user.role}
                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Courses Section */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Manage Courses ({courses.length})</h2>
                    <Link to="/admin/courses" className="btn-primary mb-4">
                        Manage All Courses
                    </Link>
                    <div className="space-y-2">
                        {courses.map(course => (
                            <div key={course._id} className="p-2 hover:bg-gray-50">
                                <p className="font-medium">{course.title}</p>
                                <p className="text-sm text-gray-500">
                                    {course.studentsEnrolled.length} enrolled
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;