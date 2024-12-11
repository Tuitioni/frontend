"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import DataTable from "@/components/ui/admin/dataTable";
import { TeacherPreview } from "@/types/Teacher";

export default function TeacherDashboard() {
  const [teachers, setTeachers] = useState<TeacherPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const apiUrl = `http://localhost:8000/teacher`;
        console.log("API URL:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch teachers");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setTeachers(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
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
    { key: "gender", label: "Gender" },
    { key: "location", label: "Location" },
  ];

  const tableData = teachers.map((teacher) => ({
    id: teacher.id,
    name: `${teacher.firstName} ${teacher.lastName}`,
    medium: teacher.profile?.medium || "N/A",
    gender: teacher.profile?.gender || "N/A",
    location: teacher.profile
      ? `${teacher.profile.area}, ${teacher.profile.district}`
      : "N/A",
  }));

  const handleView = (id: string) => {
    window.location.href = `/dashboard/teacher/${id}`;
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Teacher Dashboard
      </h1>
      <div className="w-full flex justify-center">
        <DataTable data={tableData} columns={columns} onView={handleView} />
      </div>
    </div>
  );
}
