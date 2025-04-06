import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Search, Download, BookOpen, FileText, Video, Clock } from "lucide-react";

const Library = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Resources");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseCategories, setCourseCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await axios.get('http://localhost:2000/api/library', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const categories = ["All Resources", ...new Set(response.data.map(r => r.category))];
        setCourseCategories(categories);
        setResources(response.data);
      } catch (error) {
        toast.error("Failed to load library resources");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === "All Resources" ||
        resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case "E-Book": return <BookOpen className="h-5 w-5 text-blue-500" />;
      case "Video Tutorial": return <Video className="h-5 w-5 text-red-500" />;
      case "Academic Paper": return <FileText className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDownload = async (resourceId, title) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
          `http://localhost:2000/api/library/download/${resourceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      // In a real app, you would handle the file download here
      console.log("Download URL:", response.data.fileUrl);
      toast.success(`Preparing download: ${title}`);

      // Simulate file download
      const link = document.createElement('a');
      link.href = response.data.fileUrl;
      link.target = '_blank';
      link.click();

    } catch (error) {
      toast.error(`Failed to download: ${title}`);
      console.error("Download error:", error);
    }
  };

  if (loading) {
    return (
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="ml-64 flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
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
          <main className="flex-1 p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Course Library</h1>
              <p className="text-gray-600">Resources for your enrolled courses</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    className="pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              </div>

              <select
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {courseCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {filteredResources.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    {searchQuery ? "No matching resources found" : "No resources available"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery
                        ? "Try a different search term"
                        : "Resources will appear here when you enroll in courses"}
                  </p>
                  <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All Resources");
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Reset Filters
                  </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                      <div key={resource._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                          <img
                              src={resource.image || "/book-placeholder.jpg"}
                              alt={resource.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                      <span className="px-2 py-1 bg-white/90 text-blue-600 text-xs font-medium rounded">
                        {resource.category}
                      </span>
                            <span className="px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded">
                        {resource.fileSize || "N/A"}
                      </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-gray-100 p-2 rounded-full">
                              {getResourceIcon(resource.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 line-clamp-2">{resource.title}</h3>
                              <p className="text-sm text-gray-500">by {resource.author}</p>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Added: {new Date(resource.createdAt).toLocaleDateString()}
                      </span>
                            <span className="flex items-center">
                        <Download className="w-3 h-3 mr-1" />
                              {resource.downloadCount || 0} downloads
                      </span>
                          </div>
                          <button
                              onClick={() => handleDownload(resource._id, resource.title)}
                              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </main>
        </div>
      </div>
  );
};

export default Library;