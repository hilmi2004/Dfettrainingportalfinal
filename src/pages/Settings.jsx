
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Smartphone, 
  HelpCircle, 
  LogOut, 
  Check 
} from "lucide-react";

const Settings = () => {
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
                  <h3 className="text-lg font-semibold text-gray-800">Alex Johnson</h3>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
                
                <div className="space-y-1">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-teach-blue-50 text-teach-blue-600 font-medium border-l-2 border-teach-blue-500">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Lock className="h-4 w-4" />
                      <span>Password</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4" />
                      <span>Privacy & Security</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & Support</span>
                    </div>
                  </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <div className="app-card p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="input-field"
                        placeholder="Enter your first name"
                        defaultValue="Alex"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className="input-field"
                        placeholder="Enter your last name"
                        defaultValue="Johnson"
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
                      className="input-field"
                      placeholder="Enter your email address"
                      defaultValue="alex.johnson@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="input-field"
                      placeholder="Enter your phone number"
                      defaultValue="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="input-field"
                      placeholder="Tell us about yourself"
                      defaultValue="Computer Science student with an interest in web development and artificial intelligence."
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="app-card p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Email Notifications</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-800">Course Updates</h3>
                      <p className="text-sm text-gray-500">Receive notifications about course content updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teach-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teach-blue-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-800">Assignment Reminders</h3>
                      <p className="text-sm text-gray-500">Get reminders about upcoming assignment deadlines</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teach-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teach-blue-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-800">Grade Notifications</h3>
                      <p className="text-sm text-gray-500">Receive emails when grades are posted</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teach-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teach-blue-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-800">Announcements</h3>
                      <p className="text-sm text-gray-500">Receive important announcements and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teach-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teach-blue-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-medium text-gray-800">Marketing Emails</h3>
                      <p className="text-sm text-gray-500">Receive information about new courses and features</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teach-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teach-blue-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
