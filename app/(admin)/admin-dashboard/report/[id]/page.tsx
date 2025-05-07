"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Report } from "@/types/Report";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Button } from "@/components/ui/button";
import { Notification } from "@/components/ui/Notification";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { AdminCard } from "@/components/ui/admin/adminCard";
import { Trash2, Edit } from "lucide-react";

const ReportDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { fetchWithAuth } = useAuthFetch();

  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchReport = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      setError("Report ID is missing.");
      setNotification({
        message: "Report ID is missing.",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`/api/admin/report/${id}`);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch report");
      setReport(data);
      setError(null);
    } catch (err: any) {
      console.error("Fetch error:", err);
      const message = err.message || `Failed to fetch report ${id}`;
      setError(message);
      setNotification({
        message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, fetchWithAuth]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this report?")) return;
    try {
      await fetchWithAuth(`/api/admin/report/${id}`, { method: "DELETE" });
      setNotification({
        message: "Report deleted successfully",
        type: "success",
      });
      router.push("/admin-dashboard/report");
    } catch (err: any) {
      console.error("Delete error:", err);
      const message = err.message || "Failed to delete report";
      setError(message);
      setNotification({
        message,
        type: "error",
      });
    }
  };

  if (isLoading) return <LoadingSpinnerCenter />;

  if (error && !report) {
    return (
      <div className="container mx-auto py-10 text-center">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <p className="text-red-500 mt-4">{error}</p>
        <div className="mt-4">
          <Button onClick={() => router.push("/admin-dashboard/report")}>
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-gray-600">Report not found.</p>
        <div className="mt-4">
          <Button onClick={() => router.push("/admin-dashboard/report")}>
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  const cardTitleWithActions = (
    <div className="flex justify-between items-center w-full">
      <span>Report: {report.title}</span>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin-dashboard/report/${id}/edit`)}
        >
          <Edit className="mr-1 h-4 w-4" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-1 h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  );

  const cardFooter = (
    <div className="flex justify-start">
      <Button onClick={() => router.push("/admin-dashboard/report")}>
        Back to Reports
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <AdminCard title={cardTitleWithActions} footer={cardFooter}>
        <div className="space-y-4 p-4">
          <div>
            <h3 className="font-medium text-sm text-gray-500">ID</h3>
            <p className="text-gray-900">{report.id}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Content</h3>
            <p className="text-gray-900 whitespace-pre-wrap">
              {report.content}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Report Type</h3>
            <p className="text-gray-900">{report.reportType}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Generated By</h3>
            <p className="text-gray-900">{report.generatedBy}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Created At</h3>
            <p className="text-gray-900">
              {new Date(report.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Last Updated</h3>
            <p className="text-gray-900">
              {new Date(report.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
};

export default ReportDetailPage;
