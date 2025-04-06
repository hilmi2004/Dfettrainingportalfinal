import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import {
  User, Mail, Lock, Bell, Globe, Shield,
  Smartphone, HelpCircle, LogOut, Check
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    notifications: {
      courseUpdates: true,
      assignmentReminders: true,
      gradeNotifications: true,
      announcements: true,
      marketingEmails: false
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/settings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        setFormData({
          firstName: response.data.profile.firstName,
          lastName: response.data.profile.lastName,
          email: response.data.profile.email,
          phoneNumber: response.data.profile.phoneNumber,
          bio: response.data.profile.bio,
          notifications: response.data.notifications
        });
      } catch (error) {
        toast.error("Failed to load settings");
        console.error("Settings error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/settings/profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/settings/notifications", {
        ...formData.notifications
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success("Notification settings updated");
    } catch (error) {
      toast.error("Failed to update notifications");
      console.error("Notifications error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/settings/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      logout();
      window.location.href = "/login";
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="ml-64 flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6">
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teach-blue-500"></div>
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account preferences and settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="app-card p-6 sticky top-24">
                  <div className="text-center mb-6">
                    <div className="h-20 w-20 bg-teach-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">{currentUser?.role}</p>
                  </div>

                  <div className="space-y-1">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "profile" ? "bg-teach-blue-50 text-teach-blue-600 font-medium border-l-2 border-teach-blue-500" : "text-gray-700 hover:bg-gray-100"} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </div>
                    </button>

                    <button
                        onClick={() => setActiveTab("notifications")}
                        className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "notifications" ? "bg-teach-blue-50 text-teach-blue-600 font-medium border-l-2 border-teach-blue-500" : "text-gray-700 hover:bg-gray-100"} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                      </div>
                    </button>

                    {/* Other tabs would go here */}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6">
                {activeTab === "profile" && (
                    <div className="app-card p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>

                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="input-field"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                          </div>

                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="input-field"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                              type="email"
                              id="email"
                              name="email"
                              className="input-field bg-gray-100 cursor-not-allowed"
                              placeholder="Enter your email address"
                              value={formData.email}
                              readOnly
                          />
                        </div>

                        <div>
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                              type="tel"
                              id="phoneNumber"
                              name="phoneNumber"
                              className="input-field"
                              placeholder="Enter your phone number"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                          </label>
                          <textarea
                              id="bio"
                              name="bio"
                              rows={4}
                              className="input-field"
                              placeholder="Tell us about yourself"
                              value={formData.bio}
                              onChange={handleInputChange}
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                              type="submit"
                              className="btn-primary"
                              disabled={loading}
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div className="app-card p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">Email Notifications</h2>

                      <form onSubmit={handleNotificationsSubmit}>
                        <div className="space-y-4">
                          {Object.entries(formData.notifications).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div>
                                  <h3 className="font-medium text-gray-800">
                                    {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {getNotificationDescription(key)}
                                  </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                      type="checkbox"
                                      name={key}
                                      checked={value}
                                      onChange={handleNotificationChange}
                                      className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teach-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teach-blue-500"></div>
                                </label>
                              </div>
                          ))}
                        </div>

                        <div className="flex justify-end mt-6">
                          <button
                              type="submit"
                              className="btn-primary"
                              disabled={loading}
                          >
                            {loading ? "Saving..." : "Save Preferences"}
                          </button>
                        </div>
                      </form>
                    </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
  );
};

// Helper function for notification descriptions
function getNotificationDescription(key) {
  const descriptions = {
    courseUpdates: "Receive notifications about course content updates",
    assignmentReminders: "Get reminders about upcoming assignment deadlines",
    gradeNotifications: "Receive emails when grades are posted",
    announcements: "Receive important announcements and updates",
    marketingEmails: "Receive information about new courses and features"
  };
  return descriptions[key] || "";
}

export default Settings;