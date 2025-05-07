"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/ui/admin/dataTable"; // Use default import
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Adjust path as needed
import { Input, Select, Textarea } from "@/components/ui/admin/Form"; // Adjust path as needed
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Announcement, CreateAnnouncementDto } from "@/types/Announcement";

export default function AnnouncementListPage() {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<CreateAnnouncementDto>(
    {
      title: "",
      content: "",
      targetAudience: "ALL",
    }
  );

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("/api/admin/announcement");
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const data: Announcement[] = await response.json();
      setAnnouncements(data);
    } catch (error: any) {
      console.error("Error fetching announcements:", error);
      setNotification({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleView = (id: string) => {
    router.push(`/admin-dashboard/announcement/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin-dashboard/announcement/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/api/admin/announcement/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.text(); // Read text in case it's not JSON
        throw new Error(errorData || "Failed to delete announcement");
      }
      setNotification({
        message: "Announcement deleted successfully",
        type: "success",
      });
      fetchAnnouncements(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting announcement:", error);
      setNotification({ message: error.message, type: "error" });
      setLoading(false); // Only stop loading on error, success refreshes
    }
  };

  const handleCreateInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsCreateModalOpen(false); // Close modal immediately

    try {
      const response = await fetchWithAuth("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create announcement");
      }

      setNotification({
        message: "Announcement created successfully",
        type: "success",
      });
      setNewAnnouncement({ title: "", content: "", targetAudience: "ALL" }); // Reset form
      fetchAnnouncements(); // Refresh list
    } catch (error: any) {
      console.error("Error creating announcement:", error);
      setNotification({ message: error.message, type: "error" });
      setLoading(false); // Stop loading only on error
      setIsCreateModalOpen(true); // Reopen modal on error
    }
  };

  const columns: ColumnDef<Announcement>[] = [
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "targetAudience",
      header: "Target Audience",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: { row: any }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(row.original.id)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original.id)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading && announcements.length === 0) {
    // Show spinner only on initial load
    return <LoadingSpinnerCenter />;
  }

  return (
    <div className="container mx-auto p-6">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>Create Announcement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <Input
                label="Title"
                name="title"
                value={newAnnouncement.title}
                onChange={handleCreateInputChange}
                required
              />
              <Textarea
                label="Content"
                name="content"
                value={newAnnouncement.content}
                onChange={handleCreateInputChange}
                required
                rows={5}
              />
              <Select
                label="Target Audience"
                name="targetAudience"
                value={newAnnouncement.targetAudience}
                onChange={handleCreateInputChange}
                options={[
                  { value: "ALL", label: "All Users" },
                  { value: "STUDENTS", label: "Students Only" },
                  { value: "TEACHERS", label: "Teachers Only" },
                ]}
                required
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {loading && <p>Refreshing...</p>}
      <DataTable columns={columns} data={announcements} />
    </div>
  );
}
