"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/admin/Form";
import { Hire, UpdateHireDto } from "@/types/Hire";
import { AdminCard } from "@/components/ui/admin/adminCard";
import { checkAuth, handleTokenError } from "@/utils/auth";

// Define the type for the form state based on UpdateHireDto
interface HireEditFormState extends UpdateHireDto {}

// Renamed component
export default function EditHirePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Renamed state variable
  const [formData, setFormData] = useState<HireEditFormState>({
    teacherId: "",
    studentId: "",
    fee: 0,
    paymentId: "",
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  // Renamed state variable
  const [originalHireData, setOriginalHireData] = useState<Hire | null>(null);

  useEffect(() => {
    // Renamed function
    const fetchHire = async () => {
      try {
        // Use /api/admin/hire route
        const response = await fetchWithAuth(`/api/admin/hire/${params.id}`);
        const data: Hire = await response.json();
        // Set original data
        setOriginalHireData(data);
        // Set form data based on UpdateHireDto structure
        setFormData({
          teacherId: data.teacher?.id || "",
          studentId: data.student?.id || "",
          fee: data.fee || 0,
          paymentId: data.paymentId || "",
        });
      } catch (error: any) {
        // Updated log/message
        console.error("Error fetching hire:", error);
        setError(error.message || "Failed to load hire details.");
      } finally {
        setLoading(false);
      }
    };
    // Call renamed function
    fetchHire();
  }, [params.id, fetchWithAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use originalHireData
    if (!originalHireData || !formData) return;
    setLoading(true);

    try {
      // Prepare update payload - comparing against originalHireData if needed for partial PUT
      // For now, sending the full formData as PUT usually implies replacement
      // If backend supports partial PUT, add comparison logic like in teacher edit
      const updatePayload: UpdateHireDto = { ...formData };

      // Use /api/admin/hire route with PUT
      const response = await fetchWithAuth(`/api/admin/hire/${params.id}`, {
        method: "PUT", // Using PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update hire record");
      }

      // Re-fetch or update state after successful PUT
      const updatedData: Hire = await response.json(); // Assuming PUT returns updated data
      setOriginalHireData(updatedData); // Update original data
      setFormData({
        // Update form data
        teacherId: updatedData.teacher?.id || "",
        studentId: updatedData.student?.id || "",
        fee: updatedData.fee || 0,
        paymentId: updatedData.paymentId || "",
      });

      setNotification({
        // Updated message
        message: "Hire record updated successfully",
        type: "success",
      });

      // Optional: Redirect to detail page
      // router.push(`/admin-dashboard/hire/${params.id}`);
    } catch (error: any) {
      // Updated log/message
      console.error("Error updating hire:", error);
      handleTokenError(error); // Keep or remove based on need
      setNotification({
        // Updated message
        message: error.message || "Failed to update hire record",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Ensure handleChange updates HireEditFormState correctly
  const handleChange = (
    name: keyof HireEditFormState,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button type="submit" form="edit-hire-form">
        {/* Updated Button Text */}
        Update Hire Record
      </Button>
      <Button
        variant="outline"
        // Update route path
        onClick={() => router.push(`/admin-dashboard/hire/${params.id}`)}
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      {/* Updated Title */}
      <AdminCard title="Edit Hire Record" footer={footer}>
        <form id="edit-hire-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Inputs based on UpdateHireDto */}
          <Input
            label="Teacher ID"
            name="teacherId"
            value={formData.teacherId}
            onChange={(e) => handleChange("teacherId", e.target.value)}
            required
            // Consider using a Select component if you fetch teachers
          />

          <Input
            label="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={(e) => handleChange("studentId", e.target.value)}
            required
            // Consider using a Select component if you fetch students
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
            label="Payment ID (Optional)"
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
