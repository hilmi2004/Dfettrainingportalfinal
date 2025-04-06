import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminCourses } from "@/components/admin/AdminCourses";
import { AdminLibrary } from "@/components/admin/AdminLibrary";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = React.useState("courses");

  // Redirect non-admin users
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="ml-64 flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 p-6 page-transition">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {currentUser?.firstName || 'Admin'}!
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                Admin Privileges
              </span>
              </p>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="library">Library</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="mt-0">
                <AdminCourses />
              </TabsContent>

              <TabsContent value="library" className="mt-0">
                <AdminLibrary />
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <AdminUsers />
              </TabsContent>
            </Tabs>
          </main>

          <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
          />
        </div>
      </div>
  );
};

export default Admin;