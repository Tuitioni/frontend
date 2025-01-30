"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/admin/Form";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import {
  AnnouncementDetail,
  UpdateAnnouncementDto,
} from "@/types/Announcement";

interface AnnouncementEditProps {
  params: { id: string };
}

export default function AnnouncementEdit({ params }: AnnouncementEditProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<UpdateAnnouncementDto>({
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(
          `http://localhost:8000/announcement/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch announcement");
        }

        const announcement: AnnouncementDetail = await response.json();
        setFormData({
          title: announcement.title,
          content: announcement.content,
          adminId: announcement.adminId,
        });
      } catch (error) {
        setNotification({
          message: "Failed to fetch announcement details",
          type: "error",
        });
      }
    };

    fetchAnnouncement();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `http://localhost:8000/announcement/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update announcement");
      }

      setNotification({
        message: "Announcement updated successfully",
        type: "success",
      });
      router.push("/dashboard/announcement");
    } catch (error) {
      setNotification({
        message: "Failed to update announcement",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Announcement</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          maxLength={20}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            maxLength={50}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : "Update Announcement"}
          </Button>
        </div>
      </form>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
