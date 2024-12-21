"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import DataTable from "@/components/ui/admin/dataTable";
import { ReportPreview } from "@/types/Report";

export default function ReportDashboard() {
  const [reports, setReports] = useState<ReportPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:8000/report/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== id)
      );
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch("http://localhost:8000/report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data = await response.json();
        setReports(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
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
    { key: "subject", label: "Subject" },
    { key: "status", label: "Status" },
    { key: "student", label: "Student" },
    { key: "teacher", label: "Teacher" },
    { key: "createdAt", label: "Created At" },
  ];

  const tableData = reports.map((report) => ({
    id: report.id,
    title: report.title,
    subject: report.subject,
    status: report.status,
    student: report.student
      ? `${report.student.firstName} ${report.student.lastName}`
      : "N/A",
    teacher: report.teacher
      ? `${report.teacher.firstName} ${report.teacher.lastName}`
      : "N/A",
    createdAt: new Date(report.createdAt).toLocaleDateString(),
  }));

  const handleView = (id: string) => {
    window.location.href = `/dashboard/report/${id}`;
  };

  const handleEdit = (id: string) => {
    window.location.href = `/dashboard/report/${id}/edit`;
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Report Dashboard
      </h1>
      <div className="w-full flex justify-center">
        <DataTable
          data={tableData}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
