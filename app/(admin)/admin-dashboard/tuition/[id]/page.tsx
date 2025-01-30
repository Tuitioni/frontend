"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { Button } from "@/components/ui/button";
import { Tuition } from "@/types/Tuition";
import { AdminCard } from "@/components/ui/admin/adminCard";
import { checkAuth, handleTokenError } from "@/utils/auth";

export default function TuitionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTuition() {
      try {
        const response = await fetchWithAuth(
          `http://localhost:8000/tuition/${params.id}`
        );
        const data = await response.json();
        setTuition(data);
      } catch (error: any) {
        console.error("Error fetching tuition:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTuition();
  }, [params.id, fetchWithAuth]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tuition?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:8000/tuition/${params.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("jwt expired");
        }
        throw new Error("Failed to delete tuition");
      }

      setNotification({
        message: "Tuition deleted successfully",
        type: "success",
      });

      router.push("/admin-dashboard/tuition");
    } catch (error: any) {
      console.error("Error deleting tuition:", error);
      handleTokenError(error);
      setNotification({
        message: "Failed to delete tuition",
        type: "error",
      });
    }
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  if (!tuition) {
    return <div>Tuition not found</div>;
  }

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        onClick={() =>
          router.push(`/admin-dashboard/tuition/${params.id}/edit`)
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
      <AdminCard title="Tuition Details" footer={footer}>
        <div className="grid grid-cols-2 gap-8">
          {/* Teacher Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Teacher Information</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {tuition.teacher.firstName}{" "}
                {tuition.teacher.lastName}
              </p>
              <p>
                <strong>Email:</strong> {tuition.teacher.email}
              </p>
            </div>
          </div>

          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Information</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {tuition.student.firstName}{" "}
                {tuition.student.lastName}
              </p>
              <p>
                <strong>Email:</strong> {tuition.student.email}
              </p>
            </div>
          </div>

          {/* Tuition Details */}
          <div className="col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Tuition Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Fee:</strong> ৳{tuition.fee}
              </p>
              <p>
                <strong>Payment ID:</strong>{" "}
                {tuition.paymentId || "Not assigned"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(tuition.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(tuition.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </AdminCard>

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
