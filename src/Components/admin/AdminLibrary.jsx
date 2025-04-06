
import React, { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, BookCopy, FileText, Video } from "lucide-react";

const mockResources = [
  { id: 1, title: "Introduction to React Handbook", type: "PDF", author: "Jane Smith", size: "2.4 MB", category: "Programming" },
  { id: 2, title: "JavaScript Fundamentals", type: "Book", author: "John Doe", size: "N/A", category: "Programming" },
  { id: 3, title: "Design Thinking Process", type: "Video", author: "Sarah Johnson", size: "45 MB", category: "Design" },
  { id: 4, title: "Data Analysis with Python", type: "PDF", author: "Mike Brown", size: "3.8 MB", category: "Data Science" },
  { id: 5, title: "Mobile App Development Guide", type: "Book", author: "Chris Williams", size: "N/A", category: "Mobile Development" }
];

export const AdminLibrary = () => {
  const [resources, setResources] = useState(mockResources);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    type: "PDF",
    author: "",
    size: "",
    category: ""
  });

  const handleOpenDialog = (resource = null) => {
    if (resource) {
      setFormData({ ...resource });
      setCurrentResource(resource);
    } else {
      setFormData({
        id: resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1,
        title: "",
        type: "PDF",
        author: "",
        size: "",
        category: ""
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

  const handleSubmit = () => {
    if (currentResource) {
      setResources(resources.map(resource => 
        resource.id === formData.id ? formData : resource
      ));
    } else {
      setResources([...resources, formData]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setResources(resources.filter(resource => resource.id !== id));
  };

  const getResourceIcon = (type) => {
    switch(type) {
      case 'PDF':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'Book':
        return <BookCopy className="h-4 w-4 text-blue-500" />;
      case 'Video':
        return <Video className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Library Management</h2>
        <Button onClick={() => handleOpenDialog()} className="bg-teach-blue-500 hover:bg-teach-blue-600">
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
                <TableHead>Size</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {getResourceIcon(resource.type)}
                      <span className="ml-2">{resource.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{resource.type}</TableCell>
                  <TableCell>{resource.author}</TableCell>
                  <TableCell>{resource.size}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {resource.category}
                    </span>
                  </TableCell>
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
                      onClick={() => handleDelete(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{currentResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="PDF">PDF</option>
                <option value="Book">Book</option>
                <option value="Video">Video</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">Size</Label>
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-teach-blue-500 hover:bg-teach-blue-600">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
