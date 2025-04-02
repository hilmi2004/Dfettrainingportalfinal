import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from "./Components/Landingpage.jsx";
import Footer from "./Components/Footer.jsx";
import Registrationpage from "./Components/Registrationpage.jsx";
import Astudent from "./Components/Astudent.jsx";
import Testimonial from "@/Components/Testimonial.jsx";
import {motion} from "framer-motion";
import Faq from "@/Components/Faq.jsx";
import Login  from "@/pages/Login.jsx";
import Forgetpassword from "@/pages/Forgotpassword.jsx";
import ResetPassword from "@/pages/ResetPassword.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Courses from "@/pages/Courses.jsx";
import Instructors from "@/pages/Instructors.jsx";
import Library from "@/pages/Library.jsx";
import Settings from "@/pages/Settings.jsx";
import Grades from "@/pages/Grades.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Inbox from "@/pages/Inbox.jsx";
import AdminDashboard from "@/pages/AdminDashboard.jsx";
import axios from "axios";

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const transition = { duration: 0.8, ease: "easeInOut" };

const App = () => {

    const ProtectedRoute = ({ children, allowedRoles }) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const verifyAuth = async () => {
                try {
                    const res = await axios.get('http://localhost:2000/api/auth/me', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });

                    if (!allowedRoles.includes(res.data.role)) {
                        throw new Error('Unauthorized');
                    }

                    setUser(res.data);
                } catch (error) {
                    window.location = '/login';
                } finally {
                    setLoading(false);
                }
            };

            verifyAuth();
        }, []);

        if (loading) return <div>Loading...</div>;
        return user ? children : null;
    };
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div>
                        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" transition={transition} viewport={{ once: true, amount: 0.2 }}>
                            <Landingpage />
                        </motion.div>

                        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" transition={transition} viewport={{ once: true, amount: 0.2 }}>
                            <Astudent />
                        </motion.div>

                        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" transition={transition} viewport={{ once: true, amount: 0.2 }}>
                            <Registrationpage />
                        </motion.div>

                        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" transition={transition} viewport={{ once: true, amount: 0.2 }}>
                            <Testimonial />
                        </motion.div>

                        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" transition={transition} viewport={{ once: true, amount: 0.2 }}>
                            <Faq />
                        </motion.div>

                        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" transition={transition} viewport={{ once: true, amount: 0.2 }}>
                            <Footer />
                        </motion.div>
                    </div>
                } />

                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<Forgetpassword/>} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/Courses" element={<Courses/>} />
                <Route path="/instructors" element={<Instructors/>} />
                <Route path="/inbox" element={<Inbox/>} />
                <Route path="/library" element={<Library />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/points" element={<Grades />} />
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />






            </Routes>
        </Router>
    );
};

export default App;
