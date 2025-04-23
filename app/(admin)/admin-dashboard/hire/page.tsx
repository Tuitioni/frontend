"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import DataTable from "@/components/ui/admin/dataTable";
import { HirePreview } from "@/types/Hire";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function HireDashboard() {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [hires, setHires] = useState<HirePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    const fetchHires = async () => {
      try {
        const response = await fetchWithAuth("/api/admin/hire");
        const data = await response.json();
        setHires(data);
      } catch (error: any) {
        console.error("Error fetching hires:", error);
        setError(error.message || "Failed to load hires.");
      } finally {
        setLoading(false);
      }
    };

    fetchHires();
  }, [fetchWithAuth]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hire record?")) return;

    try {
      await fetchWithAuth(`/api/admin/hire/${id}`, {
        method: "DELETE",
      });
      setHires((prev) => prev.filter((hire) => hire.id !== id));
      setNotification({
        message: "Hire record deleted successfully",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error deleting hire:", error);
      setError(error.message || "Failed to delete hire.");
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
    { key: "subject", label: "Subject" },
    { key: "level", label: "Level" },
    { key: "status", label: "Status" },
    { key: "student", label: "Student" },
    { key: "teacher", label: "Teacher" },
    { key: "createdAt", label: "Created At" },
  ];

  const tableData = hires.map((hire) => ({
    id: hire.id,
    subject: hire.subject,
    level: hire.level,
    status: hire.status,
    student: hire.student
      ? `${hire.student.firstName} ${hire.student.lastName}`
      : "N/A",
    teacher: hire.teacher
      ? `${hire.teacher.firstName} ${hire.teacher.lastName}`
      : "N/A",
    createdAt: new Date(hire.createdAt).toLocaleDateString(),
  }));

  const handleView = (id: string) => {
    router.push(`/admin-dashboard/hire/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin-dashboard/hire/${id}/edit`);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hire Dashboard</h1>
      <div className="w-full flex justify-center">
        <DataTable
          data={tableData}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
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
