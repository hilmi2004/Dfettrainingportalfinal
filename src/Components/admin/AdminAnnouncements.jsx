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
import { Textarea } from "../../components/ui/textarea";
import { Plus, Pencil, Trash2, Megaphone, AlertTriangle, Bell } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";

export const AdminAnnouncements = () => {
    const { currentUser } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        important: false
    });

    const fetchAnnouncements = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await axios.get('/api/admin/announcements', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setAnnouncements(response.data);
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
            toast.error(`Failed to load announcements: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const saveAnnouncement = async (announcementData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            if (currentAnnouncement?._id) {
                await axios.put(
                    `/api/admin/announcements/${currentAnnouncement._id}`,
                    announcementData,
                    config
                );
                toast.success("Announcement updated successfully");
            } else {
                await axios.post('/api/admin/announcements', announcementData, config);
                toast.success("Announcement created successfully");
            }

            fetchAnnouncements();
            return true;
        } catch (error) {
            console.error("Error saving announcement:", error);
            toast.error(error.response?.data?.message || "Error saving announcement");
            return false;
        }
    };

    const deleteAnnouncement = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            await axios.delete(`/api/admin/announcements/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success("Announcement deleted successfully");
            fetchAnnouncements();
        } catch (error) {
            console.error("Error deleting announcement:", error);
            toast.error(error.response?.data?.message || "Failed to delete announcement");
        }
    };

    const handleOpenDialog = (announcement = null) => {
        if (announcement) {
            setFormData({
                title: announcement.title,
                content: announcement.content,
                important: announcement.important || false
            });
            setCurrentAnnouncement(announcement);
        } else {
            setFormData({
                title: "",
                content: "",
                important: false
            });
            setCurrentAnnouncement(null);
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
            [name]: name === 'important' ? value === 'true' : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await saveAnnouncement(formData);
        if (success) {
            handleCloseDialog();
        }
    };

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            fetchAnnouncements();
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
                <div className="text-red-500">Error loading announcements: {error}</div>
                <Button
                    onClick={fetchAnnouncements}
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
                <h2 className="text-xl font-semibold text-gray-800">Announcements Management</h2>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-teach-blue-500 hover:bg-teach-blue-600"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Announcement
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Announcements</CardTitle>
                    <CardDescription>Manage system announcements and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Content</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(announcements) && announcements.length > 0 ? (
                                announcements.map((announcement) => (
                                    <TableRow key={announcement._id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                {announcement.important ? (
                                                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                                ) : (
                                                    <Bell className="h-4 w-4 mr-2 text-blue-500" />
                                                )}
                                                {announcement.title}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {announcement.content}
                                        </TableCell>
                                        <TableCell>
                                            {announcement.important ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                                    Important
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                                    Normal
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {announcement.author?.firstName} {announcement.author?.lastName}
                                        </TableCell>
                                        <TableCell>
                                            {moment(announcement.createdAt).format('MMM D, YYYY')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 mr-2"
                                                onClick={() => handleOpenDialog(announcement)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => deleteAnnouncement(announcement._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        {error ? `Error: ${error}` : "No announcements found. Create your first announcement."}
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
                            <DialogTitle>
                                {currentAnnouncement ? "Edit Announcement" : "Create New Announcement"}
                            </DialogTitle>
                            <DialogDescription>
                                {currentAnnouncement ? "Update the announcement details" : "Fill in the details for a new announcement"}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Title
                                </Label>
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
                                <Label htmlFor="important" className="text-right">
                                    Priority
                                </Label>
                                <select
                                    id="important"
                                    name="important"
                                    value={formData.important}
                                    onChange={handleInputChange}
                                    className="col-span-3 border rounded-md p-2"
                                >
                                    <option value={false}>Normal</option>
                                    <option value={true}>Important</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="content" className="text-right">
                                    Content
                                </Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    rows={5}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-teach-blue-500 hover:bg-teach-blue-600"
                            >
                                {currentAnnouncement ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};