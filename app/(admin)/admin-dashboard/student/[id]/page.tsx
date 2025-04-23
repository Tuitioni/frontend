"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { Button } from "@/components/ui/button";
import { StudentDetail } from "@/types/Student";
import { AdminCard } from "@/components/ui/admin/adminCard";

export default function StudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetchWithAuth(`/api/admin/student/${params.id}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch student");
        }
        const data = await response.json();
        setStudent(data);
      } catch (error: any) {
        console.error("Error fetching student:", error);
        setError(error.message || "Failed to load student details.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [params.id, fetchWithAuth]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await fetchWithAuth(`/api/admin/student/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete student");
      }

      setNotification({
        message: "Student deleted successfully",
        type: "success",
      });
      // Redirect back to the student list page
      router.push("/admin-dashboard/student");
    } catch (error: any) {
      console.error("Error deleting student:", error);
      // Potentially use handleTokenError if applicable
      setNotification({
        message: error.message || "Failed to delete student",
        type: "error",
      });
    }
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  if (error) {
    // Show error notification, allow dismissal
    return (
      <div className="container mx-auto py-10">
        <Notification
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
        <Button
          variant="outline"
          onClick={() => router.push("/admin-dashboard/student")}
          className="mt-4"
        >
          Back to List
        </Button>
      </div>
    );
  }

  if (!student) {
    return <div>Student record not found</div>;
  }

  // Card footer buttons
  const footer = (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        onClick={() => router.push("/admin-dashboard/student")}
      >
        Back
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          router.push(`/admin-dashboard/student/${params.id}/edit`)
        }
      >
        Edit
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <AdminCard title="Student Details" footer={footer}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold border-b pb-1 mb-2">
              Basic Information
            </h3>
            <p>
              <strong>Name:</strong> {student.firstName} {student.lastName}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(student.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(student.updatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Profile Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold border-b pb-1 mb-2">
              Profile Details
            </h3>
            {student.profile ? (
              <>
                <p>
                  <strong>District:</strong> {student.profile.district}
                </p>
                <p>
                  <strong>Area:</strong> {student.profile.area}
                </p>
                <p>
                  <strong>Gender:</strong> {student.profile.gender}
                </p>
                <p>
                  <strong>Medium:</strong> {student.profile.medium}
                </p>
                <p>
                  <strong>Age:</strong> {student.profile.age || "N/A"}
                </p>
                <p>
                  <strong>Level of Study:</strong>{" "}
                  {student.profile.levelOfStudy || "N/A"}
                </p>
                <p>
                  <strong>School:</strong> {student.profile.school || "N/A"}
                </p>
                <p>
                  <strong>College:</strong> {student.profile.college || "N/A"}
                </p>
                <p>
                  <strong>University:</strong>{" "}
                  {student.profile.university || "N/A"}
                </p>
                <p>
                  <strong>Subjects:</strong>{" "}
                  {student.profile.subjects?.join(", ") || "N/A"}
                </p>
              </>
            ) : (
              <p>No profile information available.</p>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Global Notification Area */}
      {notification && (
        <div className="mt-4">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
