"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DataTable from "@/components/ui/admin/dataTable";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { ReportPreview } from "@/types/Report";

export default function ReportDashboard() {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [reports, setReports] = useState<ReportPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetchWithAuth(
          `${process.env.TUITIONI_API}/report`
        );
        const data = await response.json();
        setReports(data);
      } catch (error: any) {
        console.error("Error fetching reports:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [fetchWithAuth]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await fetchWithAuth(`${process.env.TUITIONI_API}/report/${id}`, {
        method: "DELETE",
      });

      setReports((prev) => prev.filter((report) => report.id !== id));
    } catch (error: any) {
      console.error("Error deleting report:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
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
    router.push(`/admin-dashboard/report/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin-dashboard/report/${id}/edit`);
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
