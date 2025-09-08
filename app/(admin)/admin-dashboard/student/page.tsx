"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DataTable from "@/components/ui/admin/dataTable";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { StudentPreview } from "@/types/Student";

export default function StudentDashboard() {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [students, setStudents] = useState<StudentPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetchWithAuth(
          `${process.env.TUITIONI_API}/student`
        );
        const data = await response.json();
        setStudents(data);
      } catch (error: any) {
        console.error("Error fetching students:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [fetchWithAuth]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await fetchWithAuth(`${process.env.TUITIONI_API}/student/${id}`, {
        method: "DELETE",
      });

      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error: any) {
      console.error("Error deleting student:", error);
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
    { key: "name", label: "Name" },
    { key: "medium", label: "Medium" },
    { key: "levelOfStudy", label: "Level of Study" },
    { key: "location", label: "Location" },
  ];

  const tableData = students.map((student) => ({
    id: student.id,
    name: `${student.firstName} ${student.lastName}`,
    medium: student.profile?.medium || "N/A",
    levelOfStudy: student.profile?.levelOfStudy || "N/A",
    location: student.profile
      ? `${student.profile.area}, ${student.profile.district}`
      : "N/A",
  }));

  const handleView = (id: string) => {
    router.push(`/admin-dashboard/student/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin-dashboard/student/${id}/edit`);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Student Dashboard
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
