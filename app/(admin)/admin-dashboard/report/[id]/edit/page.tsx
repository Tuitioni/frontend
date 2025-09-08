"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Input, Select } from "@/components/ui/admin/Form";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import { ReportDetail, UpdateReportDto } from "@/types/Report";

interface ReportEditProps {
  params: { id: string };
}

export default function ReportEdit({ params }: ReportEditProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<UpdateReportDto>({
    title: "",
    subject: "",
    description: "",
    status: "pending",
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(
          `${process.env.TUITIONI_API}/report/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const report: ReportDetail = await response.json();
        setFormData({
          title: report.title,
          subject: report.subject,
          description: report.description,
          status: report.status.toLowerCase(),
          studentId: report.studentId,
          teacherId: report.teacherId,
          resolverId: report.resolverId,
        });
      } catch (error) {
        setNotification({
          message: "Failed to fetch report details",
          type: "error",
        });
      }
    };

    fetchReport();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `${process.env.TUITIONI_API}/report/${params.id}`,
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
        throw new Error("Failed to update report");
      }

      setNotification({
        message: "Report updated successfully",
        type: "success",
      });
      router.push("/admin-dashboard/report");
    } catch (error) {
      setNotification({
        message: "Failed to update report",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Report</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <Input
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
          />
        </div>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          options={[
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "resolved", label: "Resolved" },
          ]}
        />

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
            {loading ? <LoadingSpinner size="sm" /> : "Update Report"}
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
