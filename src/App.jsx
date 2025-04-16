// import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthProvider} from './context/AuthContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
// Components
import Landingpage from "./Components/Landingpage";
import Footer from "./Components/Footer";
import Registrationpage from "./Components/Registrationpage";
import Astudent from "./Components/Astudent";
import Testimonial from "./Components/Testimonial";
import Faq from "./Components/Faq";
import Login from "./pages/Login";
import Forgetpassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import Grades from "./pages/Grades";
import NotFound from "./pages/NotFound";
import Inbox from "./pages/Inbox";
import Admin from "./pages/Admin";
import InstructorDashboard from "./pages/InstructorDashboard";

// Animation Config
const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const transition = { duration: 0.8, ease: "easeInOut" };

const AppWrapper = () => {
    return (
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    );
};

const App = () => {





    const { currentUser, isLoading, isAdmin  } = useAuth();

    const ProtectedRoute = ({ children, adminOnly = false, instructorOnly = false }) => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-screen">Loading...</div>;
        }

        if (!currentUser) {
            return <Navigate to="/login" replace />;
        }

        if (adminOnly && !isAdmin) {
            return <Navigate to="/dashboard" replace />;
        }

        if (instructorOnly && currentUser.role !== 'instructor') {
            return <Navigate to="/dashboard" replace />;
        }

        return children;
    };

    const PublicRoute = ({ children, restricted = false }) => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-screen">Loading...</div>;
        }

        if (currentUser && restricted) {
            return <Navigate to="/dashboard" replace />;
        }

        return children;
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                    <PublicRoute>
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
                    </PublicRoute>
                } />

                <Route path="/login" element={
                    <PublicRoute restricted>
                        <Login />
                    </PublicRoute>
                } />

                <Route path="/forgot-password" element={
                    <PublicRoute restricted>
                        <Forgetpassword />
                    </PublicRoute>
                } />

                <Route path="/reset-password" element={
                    <PublicRoute restricted>
                        <ResetPassword />
                    </PublicRoute>
                } />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/courses" element={
                    <ProtectedRoute>
                        <Courses />
                    </ProtectedRoute>
                } />

                <Route path="/instructors" element={
                    <ProtectedRoute>
                        <Instructors />
                    </ProtectedRoute>
                } />

                <Route path="/inbox" element={
                    <ProtectedRoute>
                        <Inbox />
                    </ProtectedRoute>
                } />

                <Route path="/library" element={
                    <ProtectedRoute>
                        <Library />
                    </ProtectedRoute>
                } />

                <Route path="/settings" element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                } />

                <Route path="/grades" element={
                    <ProtectedRoute>
                        <Grades />
                    </ProtectedRoute>
                } />

                <Route path="/points" element={
                    <ProtectedRoute>
                        <Grades />
                    </ProtectedRoute>
                } />

                {/* Instructor Only Route */}
                <Route path="/instructor-dashboard" element={
                    <ProtectedRoute instructorOnly>
                        <InstructorDashboard />
                    </ProtectedRoute>
                } />

                {/* Admin Only Route */}
                <Route path="/admin/*" element={
                    <ProtectedRoute adminOnly>
                        <Admin />
                    </ProtectedRoute>
                } />

                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default AppWrapper;