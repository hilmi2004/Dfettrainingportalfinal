import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64">
                <Navbar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
