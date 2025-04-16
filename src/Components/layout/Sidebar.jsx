// src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Mail,
    BookCopy,
    Settings,
    GraduationCap,
    Coins,
    Shield, HandshakeIcon
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const Sidebar = () => {
    const location = useLocation();
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return (
            <aside className="bg-blue-500 bg-opacity-90 w-64 min-h-screen flex flex-col py-6 fixed left-0 top-0 h-full overflow-y-auto z-40">
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
            </aside>
        );
    }

    // Base navigation items for all users
    const baseNavItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
        { name: "Courses", icon: <BookOpen size={20} />, path: "/courses" },
        { name: "Instructors", icon: <Users size={20} />, path: "/instructors" },
        { name: "Inbox", icon: <Mail size={20} />, path: "/inbox" },
        { name: "Library", icon: <BookCopy size={20} />, path: "/library" },
        { name: "Grades", icon: <GraduationCap size={20} />, path: "/grades" },
        { name: "Points", icon: <Coins size={20} />, path: "/points" },
        { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    ];

    // Admin-only navigation item
    const adminNavItem = {
        name: "Admin",
        icon: <Shield size={20} />,
        path: "/admin",
        adminOnly: true
    };

    const instructorNavItem = {
        name : "Instructor",
        icon : <HandshakeIcon/>,
        path : "/instructor-dashboard",
        instructorOnly : true

    }

    // Combine nav items and conditionally add admin item
    const navItems = [
        ...baseNavItems,
        ...(currentUser?.role === 'admin' ? [adminNavItem] : []),
        ...(currentUser?.role === 'instructor' ? [instructorNavItem]:[])

    ];

    return (
        <aside className="bg-blue-500 bg-opacity-90 w-64 min-h-screen flex flex-col py-6 fixed left-0 top-0 h-full overflow-y-auto z-40 transition-all duration-300 shadow-lg">
            {/* Sidebar Header */}
            <div className="px-6 mb-6">
                <h1 className="text-2xl font-bold text-white">DFET</h1>
                <p className="text-white text-sm mt-1">Learning Management System</p>
                {currentUser?.role === 'admin' && (
                    <span className="inline-block mt-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                        Admin Mode
                    </span>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                                    location.pathname === item.path
                                        ? "bg-white text-blue-600 shadow-md"
                                        : "text-white hover:bg-blue-600/60"
                                }`}
                            >
                                {item.icon}
                                <span className="text-sm font-medium">{item.name}</span>
                                {item.adminOnly && (
                                    <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        Admin
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Support Card */}
            <div className="px-3 mt-auto pt-6">
                <div className="rounded-lg bg-blue-600 p-4 text-white shadow-md">
                    <h3 className="font-medium text-lg mb-2">Need Help?</h3>
                    <p className="text-white/90 text-sm mb-3">Our support team is ready to assist you!</p>
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium w-full hover:bg-gray-100 transition-all">
                        Contact Support
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;