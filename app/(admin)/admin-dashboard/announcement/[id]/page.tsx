"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/components/ui/admin/adminCard";
import { Button } from "@/components/ui/button";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Announcement } from "@/types/Announcement";

interface AnnouncementDetailProps {
  params: { id: string };
}

export default function AnnouncementDetailPage({
  params,
}: AnnouncementDetailProps) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "error";
  } | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(
          `/api/admin/announcement/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch announcement details");
        }
        const data: Announcement = await response.json();
        setAnnouncement(data);
      } catch (error: any) {
        console.error("Error fetching announcement:", error);
        setNotification({ message: error.message, type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [fetchWithAuth, params.id]);

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  if (notification) {
    return (
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(null)}
      />
    );
  }

  if (!announcement) {
    return <p className="text-center mt-10">Announcement not found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Announcement Details</h1>
        <div>
          <Button
            variant="outline"
            onClick={() => router.push("/admin-dashboard/announcement")}
            className="mr-2"
          >
            Back to List
          </Button>
          <Button
            onClick={() =>
              router.push(`/admin-dashboard/announcement/${params.id}/edit`)
            }
          >
            Edit Announcement
          </Button>
        </div>
      </div>
      <AdminCard title={`Announcement: ${announcement.title}`}>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Target Audience</p>
            <p className="text-lg text-gray-900">
              {announcement.targetAudience}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Content</p>
            <p className="text-lg text-gray-900 whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="text-base text-gray-900">
              {new Date(announcement.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Updated</p>
            <p className="text-base text-gray-900">
              {new Date(announcement.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
