"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import DataTable from "@/components/ui/admin/dataTable";
import { TuitionPreview } from "@/types/Tuition";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function TuitionDashboard() {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [tuitions, setTuitions] = useState<TuitionPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:8000/tuition");
        const data = await response.json();
        setTuitions(data);
      } catch (error: any) {
        console.error("Error fetching tuitions:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTuitions();
  }, [fetchWithAuth]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tuition?")) return;

    try {
      await fetchWithAuth(`http://localhost:8000/tuition/${id}`, {
        method: "DELETE",
      });

      setTuitions((prev) => prev.filter((tuition) => tuition.id !== id));
    } catch (error: any) {
      console.error("Error deleting tuition:", error);
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
    { key: "subject", label: "Subject" },
    { key: "level", label: "Level" },
    { key: "status", label: "Status" },
    { key: "student", label: "Student" },
    { key: "teacher", label: "Teacher" },
    { key: "createdAt", label: "Created At" },
  ];

  const tableData = tuitions.map((tuition) => ({
    id: tuition.id,
    subject: tuition.subject,
    level: tuition.level,
    status: tuition.status,
    student: tuition.student
      ? `${tuition.student.firstName} ${tuition.student.lastName}`
      : "N/A",
    teacher: tuition.teacher
      ? `${tuition.teacher.firstName} ${tuition.teacher.lastName}`
      : "N/A",
    createdAt: new Date(tuition.createdAt).toLocaleDateString(),
  }));

  const handleView = (id: string) => {
    router.push(`/dashboard/tuition/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/tuition/${id}/edit`);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tuition Dashboard
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
