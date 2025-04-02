
import React from "react";
import {Bell, Mail, Search, ShieldCheckIcon, User} from "lucide-react";
import { Link } from "react-router-dom";
import user from "../../../backend/models/User.js";

const Navbar = () => {
    return (
        <header className="h-16 px-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center">
                    <h1 className="text-xl font-semibold text-teach-blue-600">DFET</h1>
                </Link>
                <div className="hidden md:flex relative ml-8">
                    <input
                        type="text"
                        placeholder="Search courses, instructors..."
                        className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 w-72 focus:outline-none focus:ring-2 focus:ring-teach-blue-500/20 focus:border-teach-blue-500 transition-all duration-200"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                <Link to="/inbox" className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative">
                    <Mail className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-teach-blue-500 rounded-full"></span>
                </Link>

                {user && user.role === 'admin' && (
                    <Link
                        to="/admin-dashboard"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                        <ShieldCheckIcon className="w-5 h-5" />
                        Admin Dashboard
                    </Link>
                )}

                <div className="ml-2 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-teach-blue-500 text-white flex items-center justify-center">
                        <User className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
