"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { Button } from "@/components/ui/button";
import { Hire } from "@/types/Hire";
import { AdminCard } from "@/components/ui/admin/adminCard";
import { checkAuth, handleTokenError } from "@/utils/auth";

export default function HireDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [hire, setHire] = useState<Hire | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHire = async () => {
      try {
        const response = await fetchWithAuth(`/api/admin/hire/${params.id}`);
        const data = await response.json();
        setHire(data);
      } catch (error: any) {
        console.error("Error fetching hire:", error);
        setError(error.message || "Failed to load hire details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHire();
  }, [params.id, fetchWithAuth]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this hire record?")) return;

    try {
      await fetchWithAuth(`/api/admin/hire/${params.id}`, {
        method: "DELETE",
      });

      setNotification({
        message: "Hire record deleted successfully",
        type: "success",
      });
      router.push("/admin-dashboard/hire");
    } catch (error: any) {
      console.error("Error deleting hire:", error);
      handleTokenError(error);
      setNotification({
        message: "Failed to delete hire record",
        type: "error",
      });
    }
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  if (!hire) {
    return <div>Hire record not found</div>;
  }

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        onClick={() => router.push(`/admin-dashboard/hire/${params.id}/edit`)}
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
      <AdminCard title="Hire Details" footer={footer}>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Teacher Information</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {hire.teacher.firstName}{" "}
                {hire.teacher.lastName}
              </p>
              <p>
                <strong>Email:</strong> {hire.teacher.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Information</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {hire.student.firstName}{" "}
                {hire.student.lastName}
              </p>
              <p>
                <strong>Email:</strong> {hire.student.email}
              </p>
            </div>
          </div>

          <div className="col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Hire Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Fee:</strong> ৳{hire.fee}
              </p>
              <p>
                <strong>Payment ID:</strong> {hire.paymentId || "Not assigned"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(hire.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(hire.updatedAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {hire.status}
              </p>
              <p>
                <strong>Subject:</strong> {hire.subject}
              </p>
              <p>
                <strong>Level:</strong> {hire.level}
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
