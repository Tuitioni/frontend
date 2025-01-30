"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/teacher";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function TeacherDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetchWithAuth(
          `${process.env.TUITIONI_API}/teacher/${params.id}`
        );
        const data = await response.json();
        setTeacher(data);
      } catch (error: any) {
        console.error("Error fetching teacher:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [fetchWithAuth, params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      await fetchWithAuth(`${process.env.TUITIONI_API}/teacher/${params.id}`, {
        method: "DELETE",
      });
      router.push("/admin-dashboard/teacher");
    } catch (error: any) {
      console.error("Error deleting teacher:", error);
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

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Teacher not found
        </h1>
        <Button onClick={() => router.push("/admin-dashboard/teacher")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Details</h1>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin-dashboard/teacher")}
            >
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/admin-dashboard/teacher/${params.id}/edit`)
              }
            >
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p>
                  {teacher.firstName} {teacher.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{teacher.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{teacher.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p>{teacher.address}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Additional Information</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p>{new Date(teacher.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p>{new Date(teacher.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
