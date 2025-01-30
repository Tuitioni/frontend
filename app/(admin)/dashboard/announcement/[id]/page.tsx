"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import { AnnouncementDetail } from "@/types/Announcement";
import { AdminCard } from "@/components/ui/admin/adminCard";

export default function AnnouncementDashboardByID({
  params,
}: {
  params: { id: string };
}) {
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `http://localhost:8000/announcement/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch announcement details");
        }

        const data = await response.json();
        setAnnouncement(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [params.id]);

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

  if (!announcement) {
    return <div>No announcement found</div>;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Announcement Details
      </h1>
      <div className="grid grid-cols-1 gap-8">
        {/* Announcement Content */}
        <AdminCard
          title="Announcement"
          className="bg-white shadow-lg rounded-xl"
        >
          <div className="space-y-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Title</p>
              <p className="text-xl font-semibold text-gray-900">
                {announcement.title}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Content</p>
              <p className="text-lg text-gray-900 whitespace-pre-wrap">
                {announcement.content}
              </p>
            </div>
          </div>
        </AdminCard>

        {/* Admin Information */}
        <AdminCard title="Created By" className="bg-white shadow-lg rounded-xl">
          <div className="space-y-4">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Admin Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {announcement.admin.name}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Admin Email</p>
              <p className="text-base text-gray-900">
                {announcement.admin.email}
              </p>
            </div>
          </div>
        </AdminCard>

        {/* Timestamps */}
        <AdminCard title="Timeline" className="bg-white shadow-lg rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-base text-gray-900">
                {formatDate(announcement.createdAt)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-base text-gray-900">
                {formatDate(announcement.updatedAt)}
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
