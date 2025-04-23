"use client";

import { useState, useEffect } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/admin/Form";
import DataTable from "@/components/ui/admin/dataTable";
import { PaymentPreview } from "@/types/Payment";

interface PaymentFormData {
  tuitionId: string;
  amount: number;
  paymentMethod: string;
}

export default function PaymentDashboard() {
  const { fetchWithAuth } = useAuthFetch();
  const [payments, setPayments] = useState<PaymentPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    tuitionId: "",
    amount: 0,
    paymentMethod: "",
  });

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth("/api/admin/payment");
        if (!response.ok) throw new Error("Failed to fetch payments");
        const data = await response.json();
        setPayments(data);
      } catch (err: any) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Could not load payments.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [fetchWithAuth]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    try {
      const response = await fetchWithAuth(`/api/admin/payment/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete payment");
      }

      setPayments((prev) => prev.filter((p) => p.id !== id));
      setNotification({
        message: "Payment deleted successfully",
        type: "success",
      });
    } catch (err: any) {
      console.error("Error deleting payment:", err);
      setNotification({
        message: err.message || "Failed to delete payment",
        type: "error",
      });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetchWithAuth("/api/admin/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add payment");
      }

      const newPayment = await response.json();
      setPayments((prev) => [newPayment, ...prev]);
      setNotification({
        message: "Payment added successfully",
        type: "success",
      });
      setShowAddForm(false);
      setFormData({ tuitionId: "", amount: 0, paymentMethod: "" });
    } catch (err: any) {
      console.error("Error adding payment:", err);
      setNotification({
        message: err.message || "Failed to add payment",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && payments.length === 0) {
    return <LoadingSpinnerCenter />;
  }

  const columns = [
    { key: "tuitionId", label: "Tuition ID" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "paymentMethod", label: "Method" },
    { key: "paymentDate", label: "Date" },
  ];

  const tableData = payments.map((p) => ({
    id: p.id,
    tuitionId: p.tuitionId,
    amount: `৳${p.amount.toLocaleString()}`,
    status: p.paymentStatus,
    paymentMethod: p.paymentMethod,
    paymentDate: new Date(p.paymentDate).toLocaleDateString(),
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payments</h1>

      {error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Button onClick={() => setShowAddForm(!showAddForm)} className="mb-4">
        {showAddForm ? "Cancel" : "Add New Payment"}
      </Button>

      {showAddForm && (
        <form
          onSubmit={handleAddPayment}
          className="mb-6 p-4 border rounded bg-gray-50 space-y-3"
        >
          <h2 className="text-lg font-semibold">Add Payment</h2>
          <Input
            label="Tuition ID"
            name="tuitionId"
            value={formData.tuitionId}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Payment Method"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleFormChange}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Payment"}
          </Button>
        </form>
      )}

      <DataTable data={tableData} columns={columns} onDelete={handleDelete} />
    </div>
  );
}
