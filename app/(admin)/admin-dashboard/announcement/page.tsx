"use client";

import { useEffect, useState } from "react";

import DataTable from "@/components/ui/admin/dataTable";
import { Input } from "@/components/ui/admin/Form";
import { Modal } from "@/components/ui/admin/Modal";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import { AnnouncementPreview } from "@/types/Announcement";

export default function AnnouncementDashboard() {
  const [announcements, setAnnouncements] = useState<AnnouncementPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.TUITIONI_API}/announcement/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement.id !== id)
      );
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.TUITIONI_API}/announcement/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...newAnnouncement,
            adminId: "current-admin-id", // Replace with actual admin ID
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create announcement");
      }

      const data = await response.json();
      setAnnouncements((prev) => [...prev, data]);
      setIsModalOpen(false);
      setNewAnnouncement({ title: "", content: "" });
    } catch (err: any) {
      console.error("Create error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(
          `${process.env.TUITIONI_API}/announcement`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }

        const data = await response.json();
        setAnnouncements(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <Notification
        message={error}
        type="error"
        onClose={() => setError(null)}
      />
    );
  }

  const columns = [
    { key: "title", label: "Title" },
    { key: "content", label: "Content" },
    { key: "admin", label: "Created By" },
    { key: "createdAt", label: "Created At" },
  ];

  const tableData = announcements.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    admin: announcement.admin.name,
    createdAt: new Date(announcement.createdAt).toLocaleDateString(),
  }));

  const handleView = (id: string) => {
    window.location.href = `/admin-dashboard/announcement/${id}`;
  };

  const handleEdit = (id: string) => {
    window.location.href = `/admin-dashboard/announcement/${id}/edit`;
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Announcement Dashboard
        </h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Create Announcement
        </Button>
      </div>

      <div className="w-full flex justify-center">
        <DataTable
          data={tableData}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Announcement"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            maxLength={20}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              value={newAnnouncement.content}
              onChange={(e) =>
                setNewAnnouncement((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              maxLength={50}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
