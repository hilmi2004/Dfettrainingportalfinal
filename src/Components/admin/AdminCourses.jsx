import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

export const AdminCourses = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "3 months",
    teachingMode: "Online",
    price: 0,
    status: "pending"
  });

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure we have a valid token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('/api/admin/courses', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Handle different response formats
      let coursesData = [];
      if (Array.isArray(response.data)) {
        coursesData = response.data;
      } else if (response.data && Array.isArray(response.data.courses)) {
        coursesData = response.data.courses;
      } else if (response.data && typeof response.data === 'object') {
        coursesData = [response.data];
      } else {
        throw new Error("Unexpected data format received from server");
      }

      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch courses");

      // If unauthorized, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("You don't have permission to access this resource");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle course creation/update
  const saveCourse = async (courseData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (currentCourse?._id) {
        await axios.put(`/api/admin/courses/${currentCourse._id}`, courseData, config);
        toast.success("Course updated successfully");
      } else {
        await axios.post('/api/admin/courses', courseData, config);
        toast.success("Course created successfully");
      }

      fetchCourses();
      return true;
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(error.response?.data?.message || "Error saving course");
      return false;
    }
  };

  // Handle course deletion
  const deleteCourse = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`/api/admin/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(error.response?.data?.message || "Failed to delete course");
    }
  };

  const handleOpenDialog = (course = null) => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description || "",
        instructor: course.instructor || "",
        duration: course.duration,
        teachingMode: course.teachingMode,
        price: course.price,
        status: course.status
      });
      setCurrentCourse(course);
    } else {
      setFormData({
        title: "",
        description: "",
        instructor: "",
        duration: "3 months",
        teachingMode: "Online",
        price: 0,
        status: "pending"
      });
      setCurrentCourse(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveCourse(formData);
    if (success) {
      handleCloseDialog();
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchCourses();
    }
  }, [currentUser]);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teach-blue-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error loading courses: {error}</div>
          <Button
              onClick={fetchCourses}
              className="ml-4 bg-teach-blue-500 hover:bg-teach-blue-600"
          >
            Retry
          </Button>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Course Management</h2>
          <Button
              onClick={() => handleOpenDialog()}
              className="bg-teach-blue-500 hover:bg-teach-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Course
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
            <CardDescription>Manage your educational courses</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(courses) && courses.length > 0 ? (
                    courses.map((course) => (
                        <TableRow key={course._id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>{course.instructor || "Not assigned"}</TableCell>
                          <TableCell>{course.duration}</TableCell>
                          <TableCell>{course.teachingMode}</TableCell>
                          <TableCell>${course.price}</TableCell>
                          <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.status === 'active' ? 'bg-green-100 text-green-800' :
                              course.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status}
                      </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 mr-2"
                                onClick={() => handleOpenDialog(course)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => deleteCourse(course._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {error ? `Error: ${error}` : "No courses found. Create your first course."}
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{currentCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
                <DialogDescription>
                  {currentCourse ? "Update the course details" : "Fill in the details for a new course"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="instructor" className="text-right">Instructor</Label>
                  <Input
                      id="instructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">Duration</Label>
                  <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                  >
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teachingMode" className="text-right">Mode</Label>
                  <select
                      id="teachingMode"
                      name="teachingMode"
                      value={formData.teachingMode}
                      onChange={handleInputChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                  >
                    <option value="Online">Online</option>
                    <option value="Physical">Physical</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Price ($)</Label>
                  <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                      min="0"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-teach-blue-500 hover:bg-teach-blue-600">
                  {currentCourse ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
};