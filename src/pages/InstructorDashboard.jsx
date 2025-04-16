import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "../components/ui/card";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell
} from "../components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Mail, Users, BookOpen, Send, MessageSquare, BarChart2, Calendar, User, Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { toast } from "react-toastify";
import { Badge } from "../components/ui/badge";

const InstructorDashboard = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeCourses: 0,
        unreadMessages: 0
    });
    const [newMessage, setNewMessage] = useState({
        recipient: "",
        subject: "",
        message: ""
    });

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [coursesRes, messagesRes] = await Promise.all([
                    axios.get('/api/instructor/courses', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('/api/instructor/messages', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setCourses(coursesRes.data);
                setMessages(messagesRes.data);

                // Calculate stats
                const totalStudents = coursesRes.data.reduce(
                    (acc, course) => acc + (course.studentsEnrolled?.length || 0), 0
                );
                const unreadMessages = messagesRes.data.filter(
                    msg => !msg.read && msg.recipient === currentUser.id
                ).length;

                setStats({
                    totalStudents,
                    activeCourses: coursesRes.data.length,
                    unreadMessages
                });
            } catch (error) {
                toast.error("Failed to load data");
            }
        };

        if (currentUser?.role === 'instructor') {
            fetchInstructorData();
        }
    }, [currentUser]);

    const fetchStudents = async (courseId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/instructor/courses/${courseId}/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data);
            setSelectedCourse(courseId);
        } catch (error) {
            toast.error("Failed to load students");
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.recipient || !newMessage.message) {
            toast.warning("Please select a recipient and enter a message");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/instructor/message', newMessage, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage({ recipient: "", subject: "", message: "" });
            fetchMessages();
            toast.success("Message sent successfully");
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="ml-64 flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6 page-transition">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {currentUser?.firstName}</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    Total Students
                                </CardTitle>
                                <Users className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    Active Courses
                                </CardTitle>
                                <BookOpen className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeCourses}</div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    Unread Messages
                                </CardTitle>
                                <MessageSquare className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Courses Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Your Courses
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select
                                    onValueChange={fetchStudents}
                                    value={selectedCourse}
                                >
                                    <SelectTrigger className="mb-4">
                                        <SelectValue placeholder="Select a course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map(course => (
                                            <SelectItem key={course._id} value={course._id}>
                                                {course.title} ({course.duration})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedCourse && (
                                    <div className="mt-4 border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-gray-50">
                                                <TableRow>
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {students.length > 0 ? (
                                                    students.map(student => (
                                                        <TableRow key={student._id}>
                                                            <TableCell className="font-medium">
                                                                {student.firstName} {student.lastName}
                                                            </TableCell>
                                                            <TableCell>{student.email}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">Active</Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                                                            No students enrolled in this course
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Messaging Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Student Communication
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Recipient
                                        </label>
                                        <Select
                                            onValueChange={(value) => setNewMessage({...newMessage, recipient: value})}
                                            value={newMessage.recipient}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select student" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {students.length > 0 ? (
                                                    students.map(student => (
                                                        <SelectItem key={student._id} value={student._id}>
                                                            {student.firstName} {student.lastName}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem disabled value="none">
                                                        No students available
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Subject
                                        </label>
                                        <Input
                                            placeholder="Subject"
                                            value={newMessage.subject}
                                            onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Message
                                        </label>
                                        <Textarea
                                            placeholder="Type your message here..."
                                            value={newMessage.message}
                                            onChange={(e) => setNewMessage({...newMessage, message: e.target.value})}
                                            rows={4}
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.recipient || !newMessage.message}
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Message
                                    </Button>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Message History
                                    </h3>
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                        {messages.length > 0 ? (
                                            messages.map(message => (
                                                <div
                                                    key={message._id}
                                                    className={`p-3 border rounded-lg ${!message.read && message.recipient === currentUser.id ? 'bg-blue-50 border-blue-200' : ''}`}
                                                >
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium">
                                                            {message.sender === currentUser.id ? (
                                                                `To: ${message.recipient?.firstName || 'Student'}`
                                                            ) : (
                                                                `From: ${message.sender?.firstName || 'Instructor'}`
                                                            )}
                                                        </span>
                                                        <span className="text-gray-500">
                                                            {new Date(message.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="font-semibold mt-1">{message.subject}</p>
                                                    <p className="text-gray-600">{message.message}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                No messages yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InstructorDashboard;