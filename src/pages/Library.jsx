
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Search, Filter, Download, BookOpen, FileText, Video, Clock, ChevronDown } from "lucide-react";

const resourceCategories = [
  "All Resources",
  "E-Books",
  "Academic Papers",
  "Video Tutorials",
  "Course Materials",
  "External Links",
];

const resources = [
  {
    id: 1,
    title: "Fundamentals of Web Development",
    author: "Dr. Sarah Johnson",
    type: "E-Book",
    size: "12.4 MB",
    dateAdded: "May 15, 2023",
    downloads: 1245,
    thumbnail: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2066&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Machine Learning Principles",
    author: "Prof. Michael Chen",
    type: "Academic Paper",
    size: "3.2 MB",
    dateAdded: "May 10, 2023",
    downloads: 876,
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Effective Business Communication",
    author: "Dr. Emma Williams",
    type: "Course Material",
    size: "8.7 MB",
    dateAdded: "May 8, 2023",
    downloads: 542,
    thumbnail: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?q=80&w=2023&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "Introduction to UX/UI Design",
    author: "Alex Thompson",
    type: "Video Tutorial",
    size: "345 MB",
    dateAdded: "May 5, 2023",
    downloads: 1120,
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "Calculus for Engineers",
    author: "Prof. David Lee",
    type: "E-Book",
    size: "15.8 MB",
    dateAdded: "May 3, 2023",
    downloads: 765,
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    title: "Spanish Language Basics",
    author: "Maria Rodriguez",
    type: "Course Material",
    size: "7.2 MB",
    dateAdded: "May 2, 2023",
    downloads: 932,
    thumbnail: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const Library = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("All Resources");
  
  const filteredResources = selectedCategory === "All Resources" 
    ? resources 
    : resources.filter(resource => resource.type.includes(selectedCategory.slice(0, -1)));
  
  const getResourceIcon = () => {
    switch (true) {
      case ("E-Book"):
        return <BookOpen className="h-5 w-5 text-teach-blue-500" />;
      case ("Paper"):
        return <FileText className="h-5 w-5 text-green-500" />;
      case ("Video"):
        return <Video className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 page-transition">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Library Resources</h1>
            <p className="text-gray-600">Access study materials, books, papers, and more</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-teach-blue-500/20 focus:border-teach-blue-500 transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <span>Sort By</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 min-w-max pb-2">
              {resourceCategories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-teach-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="app-card card-hover overflow-hidden">
                <div className="h-40 relative overflow-hidden">
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-teach-blue-600">
                      {resource.type}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-gray-700">
                      {resource.size}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{resource.title}</h3>
                      <p className="text-sm text-gray-500">by {resource.author}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Added: {resource.dateAdded}</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="w-3 h-3 mr-1" />
                      <span>{resource.downloads} downloads</span>
                    </div>
                  </div>
                  
                  <button className="btn-primary w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Library;
