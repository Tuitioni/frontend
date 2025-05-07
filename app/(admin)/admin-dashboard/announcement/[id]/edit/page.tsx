"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Select, Textarea } from "@/components/ui/admin/Form";
import { Button } from "@/components/ui/button";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Announcement, UpdateAnnouncementDto } from "@/types/Announcement";

interface AnnouncementEditProps {
  params: { id: string };
}

export default function AnnouncementEditPage({
  params,
}: AnnouncementEditProps) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [originalData, setOriginalData] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<UpdateAnnouncementDto>({
    title: "",
    content: "",
    targetAudience: "ALL",
  });

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(
          `/api/admin/announcement/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch announcement");
        }
        const data: Announcement = await response.json();
        setOriginalData(data);
        setFormData({
          title: data.title,
          content: data.content,
          targetAudience: data.targetAudience,
        });
      } catch (error: any) {
        console.error("Error fetching announcement:", error);
        setNotification({
          message: "Failed to load announcement details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [fetchWithAuth, params.id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalData) return;
    setLoading(true);
    setNotification(null);

    const updatePayload: UpdateAnnouncementDto = {};

    if (formData.title !== originalData.title) {
      updatePayload.title = formData.title;
    }
    if (formData.content !== originalData.content) {
      updatePayload.content = formData.content;
    }
    if (formData.targetAudience !== originalData.targetAudience) {
      updatePayload.targetAudience = formData.targetAudience;
    }

    if (Object.keys(updatePayload).length === 0) {
      setNotification({ message: "No changes detected.", type: "info" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetchWithAuth(
        `/api/admin/announcement/${params.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update announcement");
      }

      const updatedData: Announcement = await response.json();
      setOriginalData(updatedData);
      setFormData({
        title: updatedData.title,
        content: updatedData.content,
        targetAudience: updatedData.targetAudience,
      });
      setNotification({
        message: "Announcement updated successfully",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error updating announcement:", error);
      setNotification({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !originalData) {
    return <LoadingSpinnerCenter />;
  }

  if (!originalData && !loading) {
    return (
      <div className="container mx-auto p-6">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <p className="text-center mt-10">Could not load announcement data.</p>
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Announcement</h1>
        <Button
          variant="outline"
          onClick={() =>
            router.push(`/admin-dashboard/announcement/${params.id}`)
          }
        >
          Cancel
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <Input
          label="Title"
          name="title"
          value={formData.title ?? ""}
          onChange={handleInputChange}
          required
        />
        <Textarea
          label="Content"
          name="content"
          value={formData.content ?? ""}
          onChange={handleInputChange}
          required
          rows={6}
        />
        <Select
          label="Target Audience"
          name="targetAudience"
          value={formData.targetAudience ?? "ALL"}
          onChange={handleInputChange}
          options={[
            { value: "ALL", label: "All Users" },
            { value: "STUDENTS", label: "Students Only" },
            { value: "TEACHERS", label: "Teachers Only" },
          ]}
          required
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
