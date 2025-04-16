import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "../../components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../../components/ui/dialog";
import { Plus, Pencil, Trash2, BookCopy, FileText, Video, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export const AdminLibrary = () => {
  const { currentUser } = useAuth();
  const [resources, setResources] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Web Development",
    type: "E-Book",
    fileSize: "",
    fileUrl: "",
    image: "",
    file: null,
    imageFile: null
  });

  // Fetch resources from API
  const fetchResources = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get('/api/admin/library', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch resources");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const uploadFile = async (file, isImage = false) => {
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
          isImage ? '/api/upload/image' : '/api/upload/resource',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
      );

      return isImage ? response.data.imageUrl : response.data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload ${isImage ? 'image' : 'resource'}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle resource creation/update
  const saveResource = async (resourceData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      let fileUrl = resourceData.fileUrl;
      let imageUrl = resourceData.image;

      // Upload new files if provided
      if (resourceData.file) {
        fileUrl = await uploadFile(resourceData.file);
        if (!fileUrl) return false;
      }

      if (resourceData.imageFile) {
        imageUrl = await uploadFile(resourceData.imageFile, true);
        if (!imageUrl) return false;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const payload = {
        title: resourceData.title,
        author: resourceData.author,
        category: resourceData.category,
        type: resourceData.type,
        fileSize: resourceData.fileSize,
        fileUrl,
        image: imageUrl
      };

      if (currentResource?._id) {
        await axios.put(`/api/admin/library/${currentResource._id}`, payload, config);
        toast.success("Resource updated successfully");
      } else {
        await axios.post('/api/admin/library', payload, config);
        toast.success("Resource created successfully");
      }

      fetchResources();
      return true;
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error(error.response?.data?.message || "Error saving resource");
      return false;
    }
  };

  // Handle resource deletion
  const deleteResource = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axios.delete(`/api/admin/library/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success("Resource deleted successfully");
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error(error.response?.data?.message || "Failed to delete resource");
    }
  };

  const handleOpenDialog = (resource = null) => {
    if (resource) {
      setFormData({
        title: resource.title,
        author: resource.author,
        category: resource.category,
        type: resource.type,
        fileSize: resource.fileSize,
        fileUrl: resource.fileUrl,
        image: resource.image,
        file: null,
        imageFile: null
      });
      setCurrentResource(resource);
    } else {
      setFormData({
        title: "",
        author: "",
        category: "Web Development",
        type: "E-Book",
        fileSize: "",
        fileUrl: "",
        image: "",
        file: null,
        imageFile: null
      });
      setCurrentResource(null);
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
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file,
        fileSize: formatFileSize(file.size)
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file) // For preview
      }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveResource(formData);
    if (success) {
      handleCloseDialog();
    }
  };

  const getResourceIcon = (type) => {
    switch(type) {
      case 'E-Book':
        return <BookCopy className="h-4 w-4 text-blue-500" />;
      case 'Video Tutorial':
        return <Video className="h-4 w-4 text-red-500" />;
      case 'Academic Paper':
      case 'Course Material':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchResources();
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
          <div className="text-red-500">Error loading resources: {error}</div>
          <Button
              onClick={fetchResources}
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
          <h2 className="text-xl font-semibold text-gray-800">Library Management</h2>
          <Button
              onClick={() => handleOpenDialog()}
              className="bg-teach-blue-500 hover:bg-teach-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Library Resources</CardTitle>
            <CardDescription>Manage educational materials in your library</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(resources) && resources.length > 0 ? (
                    resources.map((resource) => (
                        <TableRow key={resource._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {getResourceIcon(resource.type)}
                              <span className="ml-2">{resource.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{resource.type}</TableCell>
                          <TableCell>{resource.author}</TableCell>
                          <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {resource.category}
                      </span>
                          </TableCell>
                          <TableCell>{resource.fileSize}</TableCell>
                          <TableCell className="text-right">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 mr-2"
                                onClick={() => handleOpenDialog(resource)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => deleteResource(resource._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {error ? `Error: ${error}` : "No resources found. Add your first resource."}
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[625px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{currentResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
                <DialogDescription>
                  {currentResource ? "Update the resource details" : "Fill in the details for a new resource"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Image Upload */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">Cover Image</Label>
                  <div className="col-span-3">
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      {formData.image ? (
                          <div className="relative group">
                            <img
                                src={formData.image}
                                alt="Resource preview"
                                className="w-full h-32 object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white">Change Image</span>
                            </div>
                          </div>
                      ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center h-32">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                          Click to upload a cover image
                        </span>
                          </div>
                      )}
                    </label>
                    {isUploading && (
                        <div className="mt-2 text-sm text-gray-500">Uploading image...</div>
                    )}
                  </div>
                </div>

                {/* Resource File Upload */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">Resource File</Label>
                  <div className="col-span-3">
                    <input
                        id="file"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center h-32">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                        {formData.file ? formData.file.name : "Click to upload resource file"}
                      </span>
                        {formData.fileSize && (
                            <span className="text-xs text-gray-400 mt-1">
                          Size: {formData.fileSize}
                        </span>
                        )}
                      </div>
                    </label>
                    {isUploading && (
                        <div className="mt-2 text-sm text-gray-500">Uploading file...</div>
                    )}
                    {formData.fileUrl && !formData.file && (
                        <div className="mt-2 text-sm text-gray-500">
                          Current file: <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a>
                        </div>
                    )}
                  </div>
                </div>

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
                  <Label htmlFor="author" className="text-right">Author</Label>
                  <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="App Development">App Development</option>
                    <option value="Crypto Classes">Crypto Classes</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                  >
                    <option value="E-Book">E-Book</option>
                    <option value="Video Tutorial">Video Tutorial</option>
                    <option value="Academic Paper">Academic Paper</option>
                    <option value="Course Material">Course Material</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-teach-blue-500 hover:bg-teach-blue-600"
                    disabled={isUploading}
                >
                  {currentResource ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
};