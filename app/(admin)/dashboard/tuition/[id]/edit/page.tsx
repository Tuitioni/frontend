"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tuition, UpdateTuitionDto } from "@/types/Tuition";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/ui/admin/adminCard";
import { Input } from "@/components/ui/admin/Form";
import { Notification } from "@/components/ui/Notification";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { checkAuth, handleTokenError } from "@/utils/auth";

export default function EditTuitionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateTuitionDto>({
    teacherId: "",
    studentId: "",
    fee: 0,
    paymentId: "",
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      fetchTuition();
    }
  }, [params.id]);

  const fetchTuition = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:8000/tuition/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("jwt expired");
        }
        throw new Error("Failed to fetch tuition");
      }
      const data: Tuition = await response.json();
      setFormData({
        teacherId: data.teacher.id,
        studentId: data.student.id,
        fee: data.fee,
        paymentId: data.paymentId || "",
      });
    } catch (error: any) {
      console.error("Error fetching tuition:", error);
      handleTokenError(error);
      setNotification({
        message: "Failed to fetch tuition",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:8000/tuition/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("jwt expired");
        }
        throw new Error("Failed to update tuition");
      }

      setNotification({
        message: "Tuition updated successfully",
        type: "success",
      });

      router.push(`/dashboard/tuition/${params.id}`);
    } catch (error: any) {
      console.error("Error updating tuition:", error);
      handleTokenError(error);
      setNotification({
        message: "Failed to update tuition",
        type: "error",
      });
    }
  };

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button type="submit" form="edit-tuition-form">
        Update Tuition
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push(`/dashboard/tuition/${params.id}`)}
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <AdminCard title="Edit Tuition" footer={footer}>
        <form
          id="edit-tuition-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <Input
            label="Teacher ID"
            name="teacherId"
            value={formData.teacherId}
            onChange={(e) => handleChange("teacherId", e.target.value)}
            required
          />

          <Input
            label="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={(e) => handleChange("studentId", e.target.value)}
            required
          />

          <Input
            label="Fee"
            name="fee"
            type="number"
            value={formData.fee}
            onChange={(e) => handleChange("fee", parseInt(e.target.value))}
            required
          />

          <Input
            label="Payment ID"
            name="paymentId"
            value={formData.paymentId}
            onChange={(e) => handleChange("paymentId", e.target.value)}
          />
        </form>
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
