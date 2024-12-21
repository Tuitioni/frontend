"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import DataTable from "@/components/ui/admin/dataTable";
import { StudentPreview } from "@/types/Student";

export default function StudentDashboard() {
  const [students, setStudents] = useState<StudentPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:8000/student/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch("http://localhost:8000/student", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        setStudents(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
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
    window.location.href = `/dashboard/student/${id}`;
  };

  const handleEdit = (id: string) => {
    window.location.href = `/dashboard/student/${id}/edit`;
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
